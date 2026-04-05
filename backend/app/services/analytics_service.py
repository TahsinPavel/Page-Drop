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

# ──────────────────────────── Constants ────────────────────────────

VALID_EVENT_TYPES: set[str] = {
    "page_view",
    "whatsapp_click",
    "product_click",
    "interaction",
    "focus_time_15s",
    "focus_time_30s",
}

# ──────────────────────────── Helpers ────────────────────────────


def pct_change(current: int, previous: int) -> float:
    """Compute percentage change between two period counts."""
    if previous == 0:
        return 100.0 if current > 0 else 0.0
    return round((current - previous) / previous * 100, 1)


def classify_referrer(referrer: str) -> str:
    """Classify a referrer URL into a traffic source category."""
    if not referrer or referrer == "Direct":
        return "Direct"
    social = ["instagram", "facebook", "tiktok", "twitter", "linkedin", "youtube"]
    search = ["google", "bing", "yahoo", "duckduckgo"]
    lower = referrer.lower()
    if any(s in lower for s in social):
        return "Social"
    if any(s in lower for s in search):
        return "Search"
    return "Referral"


def is_mobile(ua: str) -> bool:
    """Determine if a user-agent string represents a mobile device."""
    if not ua:
        return False
    mobile_keywords = [
        "mobile",
        "android",
        "iphone",
        "ipad",
        "ipod",
        "blackberry",
        "windows phone",
    ]
    lower = ua.lower()
    return any(k in lower for k in mobile_keywords)


def time_ago(dt: datetime) -> str:
    """Return a human-readable relative time string."""
    now = datetime.now(timezone.utc)
    # Ensure dt is timezone-aware for safe comparison
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    diff = now - dt
    seconds = int(diff.total_seconds())
    if seconds < 0:
        return "just now"
    if seconds < 60:
        return f"{seconds} seconds ago"
    elif seconds < 3600:
        return f"{seconds // 60} minutes ago"
    elif seconds < 86400:
        return f"{seconds // 3600} hours ago"
    else:
        return f"{seconds // 86400} days ago"


# ──────────────────────────── Event tracking ────────────────────────────


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


# ──────────────────────────── Per-page analytics ────────────────────────────


async def get_page_analytics(
    db: AsyncSession,
    page_id: UUID,
    days: int = 30,
) -> dict:
    """Return full analytics breakdown for one page over the given day range.

    Includes total counts, daily breakdown, top referrers, weekly/monthly views,
    best day, click-through rate, and engagement funnel.
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

    # ── Feature 5: Funnel breakdown ──
    funnel_q = select(
        func.count().filter(PageAnalytic.event_type == "interaction").label("interactions"),
        func.count().filter(PageAnalytic.event_type == "focus_time_15s").label("focus_15s"),
    ).where(
        PageAnalytic.page_id == page_id,
        PageAnalytic.created_at >= cutoff,
    )
    funnel_result = await db.execute(funnel_q)
    funnel_row = funnel_result.one()

    funnel = {
        "visitors": total_views,
        "interactions": funnel_row.interactions or 0,
        "focus_15s": funnel_row.focus_15s or 0,
        "cta_clicks": total_whatsapp_clicks,
    }

    # ── Feature 6: Conversion baseline ──
    baseline = await get_conversion_baseline(db, page_id)
    conversion_vs_baseline = round(ctr - baseline, 2)

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
        "funnel": funnel,
        "conversion_baseline": baseline,
        "conversion_vs_baseline": conversion_vs_baseline,
    }


# ──────────────────────────── Dashboard summary ────────────────────────────


async def get_dashboard_summary(
    db: AsyncSession,
    user_id: UUID,
) -> dict:
    """Aggregate analytics across all active pages belonging to a user.

    Returns total pages, total views, total clicks, 30-day views,
    period-over-period comparison, acquisition sources, device split,
    and the best performing page.
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
            "views_change_pct": 0.0,
            "clicks_change_pct": 0.0,
            "conversion_rate": 0.0,
            "conversion_change_pct": 0.0,
            "acquisition_sources": [],
            "device_split": {"mobile_pct": 0.0, "desktop_pct": 0.0},
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

    # ── Feature 1: Period-over-period comparison ──
    sixty_cutoff = datetime.now(timezone.utc) - timedelta(days=60)

    # Current period views (last 30 days)
    current_views_q = select(func.count()).where(
        PageAnalytic.page_id.in_(page_ids),
        PageAnalytic.event_type == "page_view",
        PageAnalytic.created_at >= thirty_cutoff,
    )
    current_views = (await db.execute(current_views_q)).scalar() or 0

    # Previous period views (31-60 days ago)
    previous_views_q = select(func.count()).where(
        PageAnalytic.page_id.in_(page_ids),
        PageAnalytic.event_type == "page_view",
        PageAnalytic.created_at >= sixty_cutoff,
        PageAnalytic.created_at < thirty_cutoff,
    )
    previous_views = (await db.execute(previous_views_q)).scalar() or 0

    # Current period clicks (last 30 days)
    current_clicks_q = select(func.count()).where(
        PageAnalytic.page_id.in_(page_ids),
        PageAnalytic.event_type == "whatsapp_click",
        PageAnalytic.created_at >= thirty_cutoff,
    )
    current_clicks = (await db.execute(current_clicks_q)).scalar() or 0

    # Previous period clicks (31-60 days ago)
    previous_clicks_q = select(func.count()).where(
        PageAnalytic.page_id.in_(page_ids),
        PageAnalytic.event_type == "whatsapp_click",
        PageAnalytic.created_at >= sixty_cutoff,
        PageAnalytic.created_at < thirty_cutoff,
    )
    previous_clicks = (await db.execute(previous_clicks_q)).scalar() or 0

    views_change_pct = pct_change(current_views, previous_views)
    clicks_change_pct = pct_change(current_clicks, previous_clicks)

    # Conversion rates
    conversion_rate = round((current_clicks / current_views) * 100, 1) if current_views > 0 else 0.0
    previous_conversion = round((previous_clicks / previous_views) * 100, 1) if previous_views > 0 else 0.0
    conversion_change_pct = round(conversion_rate - previous_conversion, 1)

    # ── Feature 3: Acquisition sources ──
    ref_col = func.coalesce(func.nullif(PageAnalytic.referrer, ""), "Direct").label("source")
    acq_q = (
        select(ref_col, func.count().label("visits"))
        .where(
            PageAnalytic.page_id.in_(page_ids),
            PageAnalytic.event_type == "page_view",
            PageAnalytic.created_at >= thirty_cutoff,
        )
        .group_by(ref_col)
        .order_by(func.count().desc())
        .limit(8)
    )
    acq_result = await db.execute(acq_q)
    acq_rows = acq_result.all()

    total_acq_visits = sum(r.visits for r in acq_rows) if acq_rows else 0
    acquisition_sources = [
        {
            "source": r.source,
            "category": classify_referrer(r.source),
            "visits": r.visits,
            "percentage": round((r.visits / total_acq_visits) * 100, 1) if total_acq_visits > 0 else 0.0,
        }
        for r in acq_rows
    ]

    # ── Feature 4: Device split ──
    ua_q = (
        select(PageAnalytic.user_agent, func.count().label("count"))
        .where(
            PageAnalytic.page_id.in_(page_ids),
            PageAnalytic.event_type == "page_view",
            PageAnalytic.created_at >= thirty_cutoff,
            PageAnalytic.user_agent.isnot(None),
        )
        .group_by(PageAnalytic.user_agent)
    )
    ua_result = await db.execute(ua_q)
    ua_rows = ua_result.all()

    mobile_count = sum(r.count for r in ua_rows if is_mobile(r.user_agent or ""))
    total_device = sum(r.count for r in ua_rows)
    desktop_count = total_device - mobile_count

    if total_device > 0:
        mobile_pct = round(mobile_count / total_device * 100, 1)
        desktop_pct = round(100 - mobile_pct, 1)
    else:
        mobile_pct = 0.0
        desktop_pct = 0.0

    device_split = {"mobile_pct": mobile_pct, "desktop_pct": desktop_pct}

    return {
        "total_pages": total_pages,
        "total_views_all_time": total_views,
        "total_whatsapp_clicks_all_time": total_clicks,
        "total_views_last_30_days": views_30,
        "best_performing_page": best_performing,
        "views_change_pct": views_change_pct,
        "clicks_change_pct": clicks_change_pct,
        "conversion_rate": conversion_rate,
        "conversion_change_pct": conversion_change_pct,
        "acquisition_sources": acquisition_sources,
        "device_split": device_split,
    }


# ──────────────────────────── Catalog metrics ────────────────────────────


async def get_catalog_metrics(
    db: AsyncSession,
    user_id: UUID,
) -> dict:
    """Return per-page analytics for all active pages owned by a user.

    Used by the /analytics/catalog endpoint. Queries page_analytics for the
    last 30 days and joins with business_pages metadata.
    """
    # Get active pages
    pages_q = select(
        BusinessPage.id,
        BusinessPage.business_name,
        BusinessPage.slug,
        BusinessPage.category,
    ).where(
        BusinessPage.user_id == user_id,
        BusinessPage.is_active == True,  # noqa: E712
    )
    pages_result = await db.execute(pages_q)
    user_pages = pages_result.all()

    if not user_pages:
        return {"pages": [], "total_pages": 0}

    thirty_cutoff = datetime.now(timezone.utc) - timedelta(days=30)
    page_ids = [p.id for p in user_pages]

    # Aggregate views and clicks per page
    metrics_q = (
        select(
            PageAnalytic.page_id,
            func.count().filter(PageAnalytic.event_type == "page_view").label("views"),
            func.count().filter(PageAnalytic.event_type == "whatsapp_click").label("clicks"),
        )
        .where(
            PageAnalytic.page_id.in_(page_ids),
            PageAnalytic.created_at >= thirty_cutoff,
        )
        .group_by(PageAnalytic.page_id)
    )
    metrics_result = await db.execute(metrics_q)
    metrics_map: dict[UUID, dict] = {}
    for r in metrics_result.all():
        metrics_map[r.page_id] = {"views": r.views or 0, "clicks": r.clicks or 0}

    catalog = []
    for p in user_pages:
        m = metrics_map.get(p.id, {"views": 0, "clicks": 0})
        views = m["views"]
        clicks = m["clicks"]
        rate = round((clicks / views) * 100, 1) if views > 0 else 0.0
        catalog.append(
            {
                "page_id": str(p.id),
                "business_name": p.business_name,
                "slug": p.slug,
                "category": p.category,
                "views_30d": views,
                "clicks_30d": clicks,
                "conversion_rate": rate,
                "avg_time": None,
            }
        )

    # Sort by views descending
    catalog.sort(key=lambda x: x["views_30d"], reverse=True)

    return {"pages": catalog, "total_pages": len(catalog)}


# ──────────────────────────── Conversion baseline ────────────────────────────


async def get_conversion_baseline(
    db: AsyncSession,
    page_id: UUID,
) -> float:
    """Compute baseline conversion rate from the first 30 days of page existence.

    Used to show delta vs current rate. Returns 0.0 if no views recorded
    in the baseline window.
    """
    # Get page creation date
    page_q = select(BusinessPage.created_at).where(BusinessPage.id == page_id)
    page_result = await db.execute(page_q)
    page_row = page_result.first()
    if page_row is None:
        return 0.0

    page_created = page_row.created_at
    if page_created.tzinfo is None:
        page_created = page_created.replace(tzinfo=timezone.utc)
    baseline_end = page_created + timedelta(days=30)

    baseline_q = select(
        func.count().filter(PageAnalytic.event_type == "page_view").label("views"),
        func.count().filter(PageAnalytic.event_type == "whatsapp_click").label("clicks"),
    ).where(
        PageAnalytic.page_id == page_id,
        PageAnalytic.created_at >= page_created,
        PageAnalytic.created_at <= baseline_end,
    )
    baseline_result = await db.execute(baseline_q)
    row = baseline_result.one()

    baseline_views = row.views or 0
    baseline_clicks = row.clicks or 0

    if baseline_views == 0:
        return 0.0
    return round(baseline_clicks / baseline_views * 100, 2)


# ──────────────────────────── Recent events ────────────────────────────


async def get_recent_events(
    db: AsyncSession,
    user_id: UUID,
    limit: int = 10,
) -> dict:
    """Return the most recent analytics events across all of a user's pages.

    Each event is enriched with page name, device type, referrer category,
    and a human-readable relative timestamp.
    """
    limit = min(max(limit, 1), 50)

    events_q = (
        select(
            PageAnalytic.event_type,
            PageAnalytic.referrer,
            PageAnalytic.user_agent,
            PageAnalytic.created_at,
            BusinessPage.business_name,
            BusinessPage.slug,
        )
        .join(BusinessPage, PageAnalytic.page_id == BusinessPage.id)
        .where(
            BusinessPage.user_id == user_id,
            BusinessPage.is_active == True,  # noqa: E712
        )
        .order_by(PageAnalytic.created_at.desc())
        .limit(limit)
    )
    result = await db.execute(events_q)
    rows = result.all()

    events = []
    for r in rows:
        referrer_raw = r.referrer or ""
        events.append(
            {
                "event_type": r.event_type,
                "page_name": r.business_name,
                "page_slug": r.slug,
                "referrer": classify_referrer(referrer_raw) if not referrer_raw else referrer_raw,
                "device": "Mobile" if is_mobile(r.user_agent or "") else "Desktop",
                "time_ago": time_ago(r.created_at),
                "timestamp": r.created_at.isoformat(),
            }
        )

    return {"events": events, "total": len(events)}
