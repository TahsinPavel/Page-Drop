"""
Webhook endpoints for payment providers.

POST /api/v1/webhooks/gumroad     — Gumroad Ping
POST /api/v1/webhooks/nowpayments — NOWPayments IPN
"""

import json
import logging
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.payment_event import PaymentEvent
from app.services.payment_service import (
    activate_plan,
    deactivate_plan,
    find_user_by_email,
    get_plan_from_gumroad_permalink,
    get_plan_from_nowpayments_amount,
    verify_gumroad_secret,
    verify_nowpayments_signature,
)

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/gumroad")
async def gumroad_webhook(
    request: Request,
    secret: str = Query(default=""),
    db: AsyncSession = Depends(get_db),
) -> JSONResponse:
    """Handle Gumroad Ping webhook.

    Gumroad sends form-encoded POST data (not JSON).
    """
    # STEP 1 — Verify secret
    if not verify_gumroad_secret(secret):
        logger.warning("Invalid Gumroad webhook secret")
        raise HTTPException(status_code=401, detail="Invalid secret")

    # STEP 2 — Parse form data
    form = await request.form()
    data = dict(form)

    logger.info("Gumroad ping received: %s", data)

    # STEP 3 — Skip test payments
    if data.get("test") == "true":
        logger.info("Skipping Gumroad test payment")
        return JSONResponse({"status": "skipped", "reason": "test"})

    # STEP 4 — Extract fields
    email = data.get("email", "").lower().strip()
    permalink = data.get("product_permalink", "")
    sale_id = data.get("sale_id", "")
    subscription_id = data.get("subscription_id")
    cancelled = data.get("cancelled") == "True"
    ended = data.get("ended") == "True"
    refunded = data.get("refunded") == "True"

    # Parse price (Gumroad sends in cents as string e.g. "1200")
    try:
        price_str = data.get("price", "0")
        amount_cents = int(price_str)
    except (ValueError, TypeError):
        amount_cents = None

    # STEP 5 — Validate email
    if not email:
        logger.error("Gumroad ping missing email")
        return JSONResponse({"status": "error", "reason": "no email"})

    # STEP 6 — Find user
    user = await find_user_by_email(db, email)
    if not user:
        logger.warning("Gumroad ping: user not found for email=%s", email)
        # Still return 200 to Gumroad — don't retry
        # Store the event anyway for manual processing
        event = PaymentEvent(
            user_id=None,
            payment_provider="gumroad",
            event_type="sale_unmatched",
            provider_sale_id=sale_id,
            amount=amount_cents,
            currency="USD",
            raw_payload=data,
            is_test=False,
            processed=False,
            error_message=f"User not found for email: {email}",
        )
        db.add(event)
        await db.commit()
        return JSONResponse(
            {
                "status": "stored",
                "reason": "user_not_found",
                "email": email,
            }
        )

    # STEP 7 — Determine event type and act
    if cancelled or refunded:
        # User cancelled subscription or was refunded
        await deactivate_plan(
            db=db,
            user_id=user.id,
            payment_provider="gumroad",
            event_type="cancellation",
            raw_payload=data,
            provider_sale_id=sale_id,
        )
        return JSONResponse({"status": "deactivated", "reason": "cancelled"})

    if ended:
        # Subscription ended (expired)
        await deactivate_plan(
            db=db,
            user_id=user.id,
            payment_provider="gumroad",
            event_type="expired",
            raw_payload=data,
            provider_sale_id=sale_id,
        )
        return JSONResponse({"status": "deactivated", "reason": "ended"})

    # New sale — determine plan from permalink
    plan = get_plan_from_gumroad_permalink(permalink)
    if not plan:
        logger.error("Unknown Gumroad permalink: %s", permalink)
        return JSONResponse(
            {"status": "error", "reason": f"unknown permalink: {permalink}"}
        )

    await activate_plan(
        db=db,
        user_id=user.id,
        plan=plan,
        payment_provider="gumroad",
        provider_sub_id=subscription_id,
        provider_sale_id=sale_id,
        amount=amount_cents,
        currency="USD",
        raw_payload=data,
    )

    return JSONResponse({"status": "activated", "plan": plan, "email": email})


@router.post("/nowpayments")
async def nowpayments_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> JSONResponse:
    """Handle NOWPayments IPN webhook.

    NOWPayments sends JSON POST with HMAC-SHA512 signature
    in header ``x-nowpayments-sig``.
    """
    # STEP 1 — Read raw body (needed for signature verification)
    body_bytes = await request.body()

    # STEP 2 — Verify signature
    received_sig = request.headers.get("x-nowpayments-sig", "")
    if not verify_nowpayments_signature(body_bytes, received_sig):
        logger.warning("Invalid NOWPayments IPN signature")
        raise HTTPException(status_code=401, detail="Invalid signature")

    # STEP 3 — Parse JSON
    try:
        data = json.loads(body_bytes.decode("utf-8"))
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    logger.info("NOWPayments IPN received: %s", data)

    # STEP 4 — Extract fields
    payment_id = str(data.get("payment_id", ""))
    payment_status = data.get("payment_status", "")
    order_id = data.get("order_id", "")
    price_amount = float(data.get("price_amount", 0))
    price_currency = data.get("price_currency", "usd").upper()

    # order_id format: "{user_id}_{timestamp}" (set when creating invoice)
    # Extract user_id from order_id:
    try:
        user_id_str = order_id.split("_")[0]
        user_id = UUID(user_id_str)
    except (ValueError, IndexError, AttributeError):
        logger.error("Cannot parse user_id from order_id: %s", order_id)
        return JSONResponse(
            {"status": "error", "reason": "invalid order_id format"}
        )

    # STEP 5 — Only process 'finished' payments
    # NOWPayments sends IPN for every status change.
    # Only activate plan when status is 'finished'.
    if payment_status != "finished":
        logger.info(
            "NOWPayments IPN status=%s — not finished, skipping",
            payment_status,
        )
        # Still return 200 so they don't retry
        return JSONResponse(
            {"status": "acknowledged", "payment_status": payment_status}
        )

    # STEP 6 — Check for duplicate payment (idempotency)
    existing = await db.execute(
        select(PaymentEvent).where(
            PaymentEvent.provider_sale_id == payment_id,
            PaymentEvent.processed == True,  # noqa: E712
        )
    )
    if existing.scalar_one_or_none():
        logger.info("Duplicate NOWPayments IPN: payment_id=%s", payment_id)
        return JSONResponse({"status": "already_processed"})

    # STEP 7 — Determine plan from amount
    plan = get_plan_from_nowpayments_amount(price_amount)
    if not plan:
        logger.error("Cannot determine plan from amount: %s", price_amount)
        # Log unmatched event
        event = PaymentEvent(
            user_id=user_id,
            payment_provider="nowpayments",
            event_type="payment_received",
            provider_sale_id=payment_id,
            amount=int(price_amount * 100),
            currency=price_currency,
            raw_payload=data,
            is_test=False,
            processed=False,
            error_message=f"Unknown amount: {price_amount}",
        )
        db.add(event)
        await db.commit()
        return JSONResponse(
            {"status": "error", "reason": f"unknown amount: {price_amount}"}
        )

    # STEP 8 — Activate plan
    await activate_plan(
        db=db,
        user_id=user_id,
        plan=plan,
        payment_provider="nowpayments",
        provider_sub_id=payment_id,
        provider_sale_id=payment_id,
        amount=int(price_amount * 100),
        currency=price_currency,
        raw_payload=data,
    )

    return JSONResponse(
        {"status": "activated", "plan": plan, "payment_id": payment_id}
    )
