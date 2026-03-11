"""
Payment service for PageDrop.
Handles plan activation, deactivation, and payment event logging
for both Gumroad and NOWPayments providers.
"""

import hashlib
import hmac
import json
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.payment_event import PaymentEvent
from app.models.subscription import Subscription
from app.models.user import User

logger = logging.getLogger(__name__)


# ─── Plan Activation ─────────────────────────────────────────────


async def activate_plan(
    db: AsyncSession,
    user_id: UUID,
    plan: str,
    payment_provider: str,
    provider_sub_id: Optional[str],
    provider_sale_id: Optional[str],
    amount: Optional[int],
    currency: str,
    raw_payload: dict,
) -> None:
    """Activate a paid plan for a user.

    Steps:
    1. Log payment event with processed=False
    2. Update or create subscription row
    3. Update users.plan field
    4. Mark payment event as processed=True

    If any step fails, log error in payment_event.error_message.
    Never raises exceptions — always handles gracefully.

    ``plan`` must be ``'pro'`` or ``'business'``.
    ``current_period_end`` = now() + 31 days.
    """
    event = None
    try:
        # Step 1: Log raw payment event immediately
        event = PaymentEvent(
            user_id=user_id,
            payment_provider=payment_provider,
            event_type="sale",
            provider_sale_id=provider_sale_id,
            amount=amount,
            currency=currency,
            plan=plan,
            raw_payload=raw_payload,
            is_test=False,
            processed=False,
        )
        db.add(event)
        await db.flush()  # get event.id without committing

        # Step 2: Upsert subscription
        result = await db.execute(
            select(Subscription).where(Subscription.user_id == user_id)
        )
        subscription = result.scalar_one_or_none()
        now = datetime.now(timezone.utc)
        period_end = now + timedelta(days=31)

        if subscription:
            subscription.plan = plan
            subscription.status = "active"
            subscription.payment_provider = payment_provider
            subscription.provider_sub_id = provider_sub_id
            subscription.current_period_start = now
            subscription.current_period_end = period_end
            subscription.cancelled_at = None
            subscription.updated_at = now
        else:
            subscription = Subscription(
                user_id=user_id,
                plan=plan,
                status="active",
                payment_provider=payment_provider,
                provider_sub_id=provider_sub_id,
                current_period_start=now,
                current_period_end=period_end,
            )
            db.add(subscription)

        # Step 3: Update user.plan
        await db.execute(
            update(User)
            .where(User.id == user_id)
            .values(plan=plan, updated_at=now)
        )

        # Step 4: Mark as processed
        event.processed = True
        await db.commit()
        logger.info(
            "Plan activated: user=%s plan=%s provider=%s",
            user_id,
            plan,
            payment_provider,
        )

    except Exception as e:
        await db.rollback()
        if event and event.id:
            try:
                event.error_message = str(e)
                event.processed = False
                await db.commit()
            except Exception:
                pass
        logger.error(
            "Failed to activate plan: user=%s plan=%s error=%s",
            user_id,
            plan,
            str(e),
        )


async def deactivate_plan(
    db: AsyncSession,
    user_id: UUID,
    payment_provider: str,
    event_type: str,  # 'cancellation' or 'expired'
    raw_payload: dict,
    provider_sale_id: Optional[str] = None,
) -> None:
    """Deactivate a paid plan — downgrade user to free.

    Steps:
    1. Log payment event
    2. Update subscription: status='cancelled' or 'expired'
    3. Update users.plan = 'free'
    4. Mark event as processed

    Never raises exceptions — always handles gracefully.
    """
    event = None
    try:
        # Step 1: Log event
        event = PaymentEvent(
            user_id=user_id,
            payment_provider=payment_provider,
            event_type=event_type,
            provider_sale_id=provider_sale_id,
            raw_payload=raw_payload,
            is_test=False,
            processed=False,
        )
        db.add(event)
        await db.flush()

        # Step 2: Update subscription
        now = datetime.now(timezone.utc)
        result = await db.execute(
            select(Subscription).where(Subscription.user_id == user_id)
        )
        subscription = result.scalar_one_or_none()
        if subscription:
            subscription.status = (
                "cancelled" if event_type == "cancellation" else "expired"
            )
            subscription.plan = "free"
            subscription.cancelled_at = now
            subscription.updated_at = now

        # Step 3: Downgrade user
        await db.execute(
            update(User)
            .where(User.id == user_id)
            .values(plan="free", updated_at=now)
        )

        # Step 4: Mark processed
        event.processed = True
        await db.commit()
        logger.info(
            "Plan deactivated: user=%s event=%s provider=%s",
            user_id,
            event_type,
            payment_provider,
        )

    except Exception as e:
        await db.rollback()
        if event and event.id:
            try:
                event.error_message = str(e)
                await db.commit()
            except Exception:
                pass
        logger.error(
            "Failed to deactivate plan: user=%s error=%s", user_id, str(e)
        )


async def find_user_by_email(
    db: AsyncSession,
    email: str,
) -> Optional[User]:
    """Find a user by email address (case-insensitive)."""
    result = await db.execute(
        select(User).where(User.email == email.lower().strip())
    )
    return result.scalar_one_or_none()


async def get_user_subscription(
    db: AsyncSession,
    user_id: UUID,
) -> Optional[Subscription]:
    """Get current subscription for a user."""
    result = await db.execute(
        select(Subscription).where(Subscription.user_id == user_id)
    )
    return result.scalar_one_or_none()


# ─── Gumroad Helpers ─────────────────────────────────────────────


def verify_gumroad_secret(secret_param: str) -> bool:
    """Verify the secret query parameter on Gumroad Ping requests.

    Compares against ``GUMROAD_WEBHOOK_SECRET`` in config.
    Returns ``True`` if valid, ``False`` if not.
    """
    if not settings.gumroad_webhook_secret:
        logger.warning("GUMROAD_WEBHOOK_SECRET not set — skipping verification")
        return True  # allow in dev if not configured
    return hmac.compare_digest(
        secret_param.strip(),
        settings.gumroad_webhook_secret.strip(),
    )


def get_plan_from_gumroad_permalink(permalink: str) -> Optional[str]:
    """Map Gumroad product permalink to plan name.

    Returns ``'pro'``, ``'business'``, or ``None``.
    """
    if permalink == settings.gumroad_pro_permalink:
        return "pro"
    if permalink == settings.gumroad_business_permalink:
        return "business"
    return None


# ─── NOWPayments Helpers ─────────────────────────────────────────


def verify_nowpayments_signature(
    payload_bytes: bytes,
    received_signature: str,
) -> bool:
    """Verify NOWPayments IPN signature.

    NOWPayments signs payload with HMAC-SHA512 using IPN secret.

    Algorithm:
    1. Sort the payload JSON keys alphabetically
    2. HMAC-SHA512 the sorted JSON string with IPN secret
    3. Compare with received ``x-nowpayments-sig`` header
    """
    if not settings.nowpayments_ipn_secret:
        logger.warning("NOWPAYMENTS_IPN_SECRET not set — skipping verification")
        return True
    try:
        payload_dict = json.loads(payload_bytes.decode("utf-8"))
        sorted_payload = json.dumps(payload_dict, sort_keys=True)
        expected = hmac.new(
            settings.nowpayments_ipn_secret.encode("utf-8"),
            sorted_payload.encode("utf-8"),
            hashlib.sha512,
        ).hexdigest()
        return hmac.compare_digest(expected, received_signature.lower())
    except Exception as e:
        logger.error("NOWPayments signature verification error: %s", e)
        return False


def get_plan_from_nowpayments_amount(amount: float) -> Optional[str]:
    """Determine plan from payment amount.

    Allows ±$0.50 tolerance for exchange rate fluctuations.
    """
    pro_amount = settings.nowpayments_pro_amount
    business_amount = settings.nowpayments_business_amount
    tolerance = 0.50

    if abs(amount - pro_amount) <= tolerance:
        return "pro"
    if abs(amount - business_amount) <= tolerance:
        return "business"
    return None
