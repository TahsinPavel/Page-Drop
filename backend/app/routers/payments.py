"""
Payment API routes for frontend to call.

POST /api/v1/payments/nowpayments/create-invoice
GET  /api/v1/payments/nowpayments/status/{payment_id}
GET  /api/v1/payments/subscription
POST /api/v1/payments/subscription/cancel
"""

import logging
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.subscription import Subscription
from app.models.user import User
from app.services.nowpayments_service import (
    create_payment_invoice,
    get_payment_status,
)
from app.services.payment_service import get_user_subscription

router = APIRouter()
logger = logging.getLogger(__name__)


class CreateInvoiceRequest(BaseModel):
    """Request body for creating a NOWPayments invoice."""

    plan: str  # 'pro' or 'business'


class SubscriptionResponse(BaseModel):
    """Subscription details returned to the frontend."""

    plan: str
    status: str
    payment_provider: Optional[str]
    current_period_end: Optional[datetime]
    cancelled_at: Optional[datetime]


@router.post("/nowpayments/create-invoice")
async def create_nowpayments_invoice(
    body: CreateInvoiceRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a NOWPayments USDT invoice for the current user.

    Validates plan is ``'pro'`` or ``'business'``.
    Generates ``order_id``: ``"{user_id}_{unix_timestamp}"``.
    Returns invoice data including ``payment_url`` and ``pay_address``.
    """
    if body.plan not in ("pro", "business"):
        raise HTTPException(
            status_code=400,
            detail="Plan must be 'pro' or 'business'",
        )

    timestamp = int(datetime.now(timezone.utc).timestamp())
    order_id = f"{current_user.id}_{timestamp}"

    invoice = await create_payment_invoice(
        plan=body.plan,
        user_email=current_user.email,
        order_id=order_id,
    )
    return invoice


@router.get("/nowpayments/status/{payment_id}")
async def check_nowpayments_status(
    payment_id: str,
    current_user: User = Depends(get_current_user),
):
    """Check status of a NOWPayments payment.

    Frontend polls this to detect when payment is confirmed.
    Returns full payment status object.
    """
    return await get_payment_status(payment_id)


@router.get("/subscription", response_model=SubscriptionResponse)
async def get_my_subscription(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> SubscriptionResponse:
    """Get current user's subscription details.

    If no subscription row exists, return free plan defaults.
    """
    subscription = await get_user_subscription(db, current_user.id)
    if not subscription:
        return SubscriptionResponse(
            plan="free",
            status="active",
            payment_provider=None,
            current_period_end=None,
            cancelled_at=None,
        )
    return SubscriptionResponse(
        plan=subscription.plan,
        status=subscription.status,
        payment_provider=subscription.payment_provider,
        current_period_end=subscription.current_period_end,
        cancelled_at=subscription.cancelled_at,
    )


@router.post("/subscription/cancel")
async def cancel_subscription(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Mark subscription as cancelled in our database.

    User keeps access until ``current_period_end``.

    Note: This does **not** cancel on Gumroad/NOWPayments automatically.
    User must also cancel on their payment provider.
    """
    result = await db.execute(
        select(Subscription).where(
            Subscription.user_id == current_user.id
        )
    )
    subscription = result.scalar_one_or_none()

    if not subscription or subscription.plan == "free":
        return {
            "success": True,
            "message": "No active subscription to cancel.",
        }

    now = datetime.now(timezone.utc)
    subscription.status = "cancelled"
    subscription.cancelled_at = now
    subscription.updated_at = now
    await db.commit()

    return {
        "success": True,
        "message": (
            "Subscription marked as cancelled. "
            "You'll keep access until your billing period ends. "
            "Please also cancel on your payment provider "
            "(Gumroad or NOWPayments) to stop future charges."
        ),
        "access_until": (
            subscription.current_period_end.isoformat()
            if subscription.current_period_end
            else None
        ),
    }
