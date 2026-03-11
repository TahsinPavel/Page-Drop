"""Waitlist router — public endpoints for collecting upgrade-interest emails."""

import logging

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.waitlist import Waitlist
from app.schemas.waitlist import WaitlistCountResponse, WaitlistJoin, WaitlistResponse

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Waitlist"])


@router.post("/join", response_model=WaitlistResponse)
async def join_waitlist(
    body: WaitlistJoin,
    db: AsyncSession = Depends(get_db),
) -> WaitlistResponse:
    """Add an email to the paid-plan waitlist. Always returns success=True."""
    try:
        # Check if already on waitlist
        result = await db.execute(
            select(Waitlist).where(Waitlist.email == body.email).limit(1)
        )
        existing = result.scalars().first()

        if existing:
            return WaitlistResponse(
                success=True,
                message="You're already on the waitlist! We'll notify you.",
            )

        entry = Waitlist(email=body.email, plan_interest=body.plan_interest)
        db.add(entry)
        await db.flush()

        return WaitlistResponse(
            success=True,
            message="You're on the waitlist! We'll email you at launch.",
        )
    except Exception:
        logger.exception("Waitlist join error for %s", body.email)
        return WaitlistResponse(
            success=True,
            message="You're on the waitlist! We'll email you at launch.",
        )


@router.get("/count", response_model=WaitlistCountResponse)
async def get_waitlist_count(
    db: AsyncSession = Depends(get_db),
) -> WaitlistCountResponse:
    """Return how many people are on each plan's waitlist."""
    result = await db.execute(
        select(Waitlist.plan_interest, func.count().label("count")).group_by(
            Waitlist.plan_interest
        )
    )
    rows = {r.plan_interest: r.count for r in result.all()}

    pro_count = rows.get("pro", 0)
    business_count = rows.get("business", 0)

    return WaitlistCountResponse(
        pro_count=pro_count,
        business_count=business_count,
        total=pro_count + business_count,
    )
