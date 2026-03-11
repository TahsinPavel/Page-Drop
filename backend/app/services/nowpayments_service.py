"""
NOWPayments API integration.
Handles creating payment invoices for USDT TRC-20.
"""

import logging

import httpx
from fastapi import HTTPException

from app.config import settings

logger = logging.getLogger(__name__)

NOWPAYMENTS_API_BASE = "https://api.nowpayments.io/v1"


async def create_payment_invoice(
    plan: str,
    user_email: str,
    order_id: str,
) -> dict:
    """Create a NOWPayments payment invoice.

    Parameters:
        plan: ``'pro'`` or ``'business'``
        user_email: customer email (stored in order description)
        order_id: unique ID for this order (``user_id`` + timestamp)

    Returns:
        dict with ``payment_id``, ``payment_url``, ``pay_address``,
        ``pay_amount``, ``price_amount``, ``pay_currency``,
        ``order_id``, ``expiration_estimate_date``.

    Raises:
        HTTPException(502): If NOWPayments API fails.
    """
    if plan == "pro":
        amount = settings.nowpayments_pro_amount
    elif plan == "business":
        amount = settings.nowpayments_business_amount
    else:
        raise HTTPException(status_code=400, detail="Invalid plan")

    payload = {
        "price_amount": amount,
        "price_currency": "usd",
        "pay_currency": "usdttrc20",
        "order_id": order_id,
        "order_description": f"PageDrop {plan.title()} Plan - {user_email}",
        "ipn_callback_url": f"{settings.frontend_url.rstrip('/')}"
        .replace("localhost:3000", "localhost:8000")
        + "/api/v1/webhooks/nowpayments"
        if "localhost" in settings.frontend_url
        else f"{settings.frontend_url.rstrip('/')}/api/v1/webhooks/nowpayments",
        "success_url": (
            f"{settings.frontend_url}/dashboard?payment=success&plan={plan}"
        ),
        "cancel_url": f"{settings.frontend_url}/pricing?payment=cancelled",
        "is_fixed_rate": False,
        "is_fee_paid_by_user": False,
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{NOWPAYMENTS_API_BASE}/invoice",
                json=payload,
                headers={"x-api-key": settings.nowpayments_api_key},
            )
            if response.status_code != 200:
                logger.error(
                    "NOWPayments invoice creation failed: status=%s body=%s",
                    response.status_code,
                    response.text,
                )
                raise HTTPException(
                    status_code=502,
                    detail="Payment service unavailable. Please try again.",
                )
            return response.json()
    except httpx.HTTPError as exc:
        logger.error("NOWPayments API error: %s", exc)
        raise HTTPException(
            status_code=502,
            detail="Payment service unavailable. Please try again.",
        ) from exc


async def get_payment_status(payment_id: str) -> dict:
    """Check status of an existing NOWPayments payment.

    Payment status values:
    - ``'waiting'``    — payment not received yet
    - ``'confirming'`` — transaction seen, waiting for confirmations
    - ``'confirmed'``  — payment confirmed
    - ``'sending'``    — forwarding to your wallet
    - ``'finished'``   — payment complete ✅
    - ``'failed'``     — payment failed
    - ``'expired'``    — invoice expired

    Raises:
        HTTPException(502): On failure.
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{NOWPAYMENTS_API_BASE}/payment/{payment_id}",
                headers={"x-api-key": settings.nowpayments_api_key},
            )
            if response.status_code != 200:
                logger.error(
                    "NOWPayments status check failed: status=%s body=%s",
                    response.status_code,
                    response.text,
                )
                raise HTTPException(
                    status_code=502,
                    detail="Payment service unavailable. Please try again.",
                )
            return response.json()
    except httpx.HTTPError as exc:
        logger.error("NOWPayments API error: %s", exc)
        raise HTTPException(
            status_code=502,
            detail="Payment service unavailable. Please try again.",
        ) from exc
