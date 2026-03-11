"""Analytics service — event tracking and aggregation queries."""

import hashlib
import logging
from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import Request
from sqlalchemy import func, select, text, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.analytics import PageAnalytic
from app.models.business_page import BusinessPage

logger = logging.getLogger(__name__)


async def track_event(
    db: AsyncSession,
    page_id: UUID,
    event_type: str,
    request: Request,
) -> None:
    """Record a single analytics event with hashed IP, user-agent, and referrer.

    Also increments the counter columns on business_pages for backwards compatibility.
    Wrapped in try/except so analytics failures never break the main response.
    """
    try:
        # Hash visitor IP for privacy (never store raw IP)
        client_ip = request.client.host if request.client else ""
        ip_hash = hashlib.sha256(client_ip.encode()).hexdigest() if client_ip else None

        user_agent = (request.headers.get("user-agent") or "")[:500] or None
        referrer = (request.headers.get("referer") or "")[:500] or None

        event = PageAnalytic(
            page_id=page_id,
            event_type=event_type,
            visitor_ip_hash=ip_hash,
            user_agent=user_agent,
            referrer=referrer,
        )
        db.add(event)

        # Also update legacy counter columns
        if event_type == "page_view":
            await db.execute(
                update(BusinessPage)
                .where(BusinessPage.id == page_id)
                .values(page_views=BusinessPage.page_views + 1)
            )
        elif event_type == "whatsapp_click":
            await db.execute(
                update(BusinessPage)
                .where(BusinessPage.id == page_id)
                .values(whatsapp_clicks=BusinessPage.whatsapp_clicks + 1)
            )

        await db.flush()
    except Exception:
        logger.exception("Failed to track analytics event for page %s", page_id)


async def get_page_analytics(
    db: AsyncSession,
    page_id: UUID,
    days: int = 30,
) -> dict:
    """Return full analytics breakdown for one page over the given day range.

    Includes total counts, daily breakdown, top referrers, weekly/monthly views,
    best day, and click-through rate.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)

    # 1. Total counts with conditional aggregation
    totals_q = select(
        func.count().filter(PageAnalytic.event_type == "page_view").label("total_views"),
        func.count().filter(PageAnalytic.event_type == "whatsapp_click").label("total_whatsapp_clicks"),
        func.count().filter(PageAnalytic.event_type == "product_click").label("total_product_clicks"),
    ).where(
        PageAnalytic.page_id == page_id,
        PageAnalytic.created_at >= cutoff,
    )
    totals_result = await db.execute(totals_q)
    totals = totals_result.one()
    total_views = totals.total_views or 0
    total_whatsapp_clicks = totals.total_whatsapp_clicks or 0
    total_product_clicks = totals.total_product_clicks or 0

    # 2. Views by day
    date_col = func.date(PageAnalytic.created_at).label("date")
    by_day_q = (
        select(
            date_col,
            func.count().filter(PageAnalytic.event_type == "page_view").label("views"),
            func.count().filter(PageAnalytic.event_type == "whatsapp_click").label("clicks"),
        )
        .where(PageAnalytic.page_id == page_id, PageAnalytic.created_at >= cutoff)
        .group_by(date_col)
        .order_by(date_col)
    )
    by_day_result = await db.execute(by_day_q)
    by_day_rows = {str(r.date): {"views": r.views, "clicks": r.clicks} for r in by_day_result.all()}

    # Fill missing dates with 0
    views_by_day = []
    for i in range(days):
        d = (datetime.now(timezone.utc) - timedelta(days=days - 1 - i)).strftime("%Y-%m-%d")
        data = by_day_rows.get(d, {"views": 0, "clicks": 0})
        views_by_day.append({"date": d, "views": data["views"], "clicks": data["clicks"]})

    # 3. Top referrers
    ref_col = func.coalesce(func.nullif(PageAnalytic.referrer, ""), "Direct").label("referrer")
    ref_q = (
        select(ref_col, func.count().label("count"))
        .where(
            PageAnalytic.page_id == page_id,
            PageAnalytic.event_type == "page_view",
            PageAnalytic.created_at >= cutoff,
        )
        .group_by(ref_col)
        .order_by(func.count().desc())
        .limit(5)
    )
    ref_result = await db.execute(ref_q)
    top_referrers = [{"referrer": r.referrer, "count": r.count} for r in ref_result.all()]

    # 4 & 5. Views last 7 / 30 days
    seven_cutoff = datetime.now(timezone.utc) - timedelta(days=7)
    thirty_cutoff = datetime.now(timezone.utc) - timedelta(days=30)

    v7_q = select(func.count()).where(
        PageAnalytic.page_id == page_id,
        PageAnalytic.event_type == "page_view",
        PageAnalytic.created_at >= seven_cutoff,
    )
    v30_q = select(func.count()).where(
        PageAnalytic.page_id == page_id,
        PageAnalytic.event_type == "page_view",
        PageAnalytic.created_at >= thirty_cutoff,
    )
    views_7 = (await db.execute(v7_q)).scalar() or 0
    views_30 = (await db.execute(v30_q)).scalar() or 0

    # 6. Best day
    best_day = None
    if views_by_day:
        best = max(views_by_day, key=lambda x: x["views"])
        if best["views"] > 0:
            best_day = {"date": best["date"], "views": best["views"]}

    # Click-through rate
    ctr = round((total_whatsapp_clicks / total_views) * 100, 2) if total_views > 0 else 0.0

    return {
        "total_views": total_views,
        "total_whatsapp_clicks": total_whatsapp_clicks,
        "total_product_clicks": total_product_clicks,
        "click_through_rate": ctr,
        "views_by_day": views_by_day,
        "top_referrers": top_referrers,
        "views_last_7_days": views_7,
        "views_last_30_days": views_30,
        "best_day": best_day,
    }


async def get_dashboard_summary(
    db: AsyncSession,
    user_id: UUID,
) -> dict:
    """Aggregate analytics across all active pages belonging to a user.

    Returns total pages, total views, total clicks, 30-day views,
    and the best performing page (by legacy page_views counter).
    """
    # 1. Get user's active pages
    pages_q = select(
        BusinessPage.id, BusinessPage.business_name, BusinessPage.slug, BusinessPage.page_views
    ).where(BusinessPage.user_id == user_id, BusinessPage.is_active == True)  # noqa: E712
    pages_result = await db.execute(pages_q)
    user_pages = pages_result.all()

    if not user_pages:
        return {
            "total_pages": 0,
            "total_views_all_time": 0,
            "total_whatsapp_clicks_all_time": 0,
            "total_views_last_30_days": 0,
            "best_performing_page": None,
        }

    page_ids = [p.id for p in user_pages]
    total_pages = len(user_pages)

    # 2. Total views all time
    views_q = select(func.count()).where(
        PageAnalytic.page_id.in_(page_ids),
        PageAnalytic.event_type == "page_view",
    )
    total_views = (await db.execute(views_q)).scalar() or 0

    # 3. Total whatsapp clicks all time
    clicks_q = select(func.count()).where(
        PageAnalytic.page_id.in_(page_ids),
        PageAnalytic.event_type == "whatsapp_click",
    )
    total_clicks = (await db.execute(clicks_q)).scalar() or 0

    # 4. Views last 30 days
    thirty_cutoff = datetime.now(timezone.utc) - timedelta(days=30)
    v30_q = select(func.count()).where(
        PageAnalytic.page_id.in_(page_ids),
        PageAnalytic.event_type == "page_view",
        PageAnalytic.created_at >= thirty_cutoff,
    )
    views_30 = (await db.execute(v30_q)).scalar() or 0

    # 5. Best performing page (by legacy counter column)
    best = max(user_pages, key=lambda p: p.page_views)
    best_performing = (
        {"slug": best.slug, "business_name": best.business_name, "views": best.page_views}
        if best.page_views > 0
        else None
    )

    return {
        "total_pages": total_pages,
        "total_views_all_time": total_views,
        "total_whatsapp_clicks_all_time": total_clicks,
        "total_views_last_30_days": views_30,
        "best_performing_page": best_performing,
    }
