"""Pages router — CRUD, public access, analytics, regeneration, and logo upload."""

import uuid
from copy import deepcopy

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Request, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy import func, select

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.business_page import BusinessPage
from app.schemas.business_page import (
    CatalogResponse,
    DashboardSummaryResponse,
    PageAnalyticsResponse,
    PageCreate,
    PageResponse,
    PageUpdate,
    PublicPageResponse,
    RecentEventsResponse,
    TrackEventRequest,
    UploadResponse,
)
from app.services import ai_service, page_service, upload_service
from app.services import analytics_service

router = APIRouter(prefix="/pages", tags=["Pages"])


# ──────────────────────────── Protected routes ────────────────────────────


@router.post("/", response_model=PageResponse, status_code=status.HTTP_201_CREATED)
async def create_page(
    body: PageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PageResponse:
    """Create a new business page and auto-generate AI content."""
    # ── Free-plan limit: 1 active page ──
    count_query = select(func.count()).where(
        BusinessPage.user_id == current_user.id,
        BusinessPage.is_active == True,  # noqa: E712
    )
    result = await db.execute(count_query)
    active_count = result.scalar() or 0
    if active_count >= 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": "page_limit_reached",
                "message": "Free plan allows only 1 active page.",
                "upgrade_message": "Paid plans coming soon. Join our waitlist!",
            },
        )

    page = await page_service.create_page(db, body, current_user.id)

    # Trigger AI generation in the background-ish (still awaited for this request)
    products = [p.model_dump() for p in body.products] if body.products else None
    ai_data = await ai_service.generate_content(
        business_name=body.business_name,
        category=body.category,
        products=products,
        location=body.location,
        phone_number=body.phone_number,
        business_hours=body.business_hours,
        is_online_only=body.is_online_only,
    )
    page = await page_service.apply_ai_content(db, page, ai_data)

    return PageResponse.model_validate(page)


@router.get("/my-pages", response_model=list[PageResponse])
async def list_my_pages(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[PageResponse]:
    """List all pages belonging to the current user."""
    pages = await page_service.get_user_pages(db, current_user.id)
    return [PageResponse.model_validate(p) for p in pages]


@router.get("/my-pages/{page_id}", response_model=PageResponse)
async def get_my_page(
    page_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PageResponse:
    """Get a single page by ID (must belong to current user)."""
    page = await page_service.get_user_page_by_id(db, page_id, current_user.id)
    if page is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found.")
    return PageResponse.model_validate(page)


@router.put("/my-pages/{page_id}", response_model=PageResponse)
async def update_my_page(
    page_id: uuid.UUID,
    body: PageUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PageResponse:
    """Update a page. Re-triggers AI if business_name or products change."""
    page = await page_service.get_user_page_by_id(db, page_id, current_user.id)
    if page is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found.")

    update_dict = body.model_dump(exclude_unset=True)
    page = await page_service.update_page(db, page, body)

    # Re-trigger AI if key fields changed
    if "business_name" in update_dict or "products" in update_dict:
        products = (
            [p.model_dump() if hasattr(p, "model_dump") else p for p in body.products]
            if body.products
            else ([p for p in page.products] if page.products else None)
        )
        ai_data = await ai_service.generate_content(
            business_name=page.business_name,
            category=page.category,
            products=products,
            location=page.location,
            phone_number=page.phone_number,
            business_hours=page.business_hours,
            is_online_only=page.is_online_only,
        )
        page = await page_service.apply_ai_content(db, page, ai_data)

    return PageResponse.model_validate(page)


@router.delete("/my-pages/{page_id}", status_code=status.HTTP_200_OK)
async def delete_my_page(
    page_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Soft-delete a page (sets is_active = false)."""
    page = await page_service.get_user_page_by_id(db, page_id, current_user.id)
    if page is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found.")
    await page_service.soft_delete_page(db, page)
    return {"detail": "Page deleted successfully."}


@router.post("/my-pages/{page_id}/regenerate-ai", response_model=PageResponse)
async def regenerate_ai(
    page_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PageResponse:
    """Re-run AI content generation for an existing page."""
    page = await page_service.get_user_page_by_id(db, page_id, current_user.id)
    if page is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found.")

    products = page.products if page.products else None
    ai_data = await ai_service.generate_content(
        business_name=page.business_name,
        category=page.category,
        products=products,
        location=page.location,
        phone_number=page.phone_number,
        business_hours=page.business_hours,
        is_online_only=page.is_online_only,
    )
    page = await page_service.apply_ai_content(db, page, ai_data)
    return PageResponse.model_validate(page)


# ──────────────────────────── Analytics routes ────────────────────────────


@router.get("/my-pages/{page_id}/analytics", response_model=PageAnalyticsResponse)
async def get_page_analytics(
    page_id: uuid.UUID,
    days: int = Query(default=30, ge=7, le=90),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PageAnalyticsResponse:
    """Return detailed analytics for a single page owned by the current user."""
    page = await page_service.get_user_page_by_id(db, page_id, current_user.id)
    if page is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Page not found or you don't have access.",
        )
    data = await analytics_service.get_page_analytics(db, page_id, days)
    return PageAnalyticsResponse(**data)


@router.get("/analytics/summary", response_model=DashboardSummaryResponse)
async def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> DashboardSummaryResponse:
    """Return aggregated analytics across all of the current user's pages."""
    data = await analytics_service.get_dashboard_summary(db, current_user.id)
    return DashboardSummaryResponse(**data)


@router.get("/analytics/catalog", response_model=CatalogResponse)
async def get_analytics_catalog(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CatalogResponse:
    """Return per-page analytics metrics for all active pages owned by the user."""
    data = await analytics_service.get_catalog_metrics(db, current_user.id)
    return CatalogResponse(**data)


@router.get("/analytics/recent-events", response_model=RecentEventsResponse)
async def get_recent_events(
    limit: int = Query(default=10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> RecentEventsResponse:
    """Return the most recent analytics events across all of the user's pages."""
    data = await analytics_service.get_recent_events(db, current_user.id, limit)
    return RecentEventsResponse(**data)


# ──────────────────────────── Public routes ────────────────────────────


@router.get("/public/{slug}", response_model=PublicPageResponse)
async def get_public_page(
    slug: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> PublicPageResponse:
    """Return a public business page by slug and track the page view."""
    page = await page_service.get_public_page_by_slug(db, slug)
    if page is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found.")

    await analytics_service.track_event(db, page.id, "page_view", request)
    # Refresh to get updated counter
    await db.refresh(page)

    return PublicPageResponse.model_validate(page)


@router.post("/public/{slug}/whatsapp-click")
async def track_whatsapp_click(
    slug: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Track a WhatsApp click event for a page."""
    page = await page_service.get_public_page_by_slug(db, slug)
    if page is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found.")

    await analytics_service.track_event(db, page.id, "whatsapp_click", request)
    return {"success": True}


@router.post("/public/{slug}/event")
async def track_custom_event(
    slug: str,
    body: TrackEventRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Track a custom analytics event for a page (public, no auth).

    Accepts event types: interaction, focus_time_15s, focus_time_30s, product_click.
    Silently rejects invalid event types (fire-and-forget from frontend).
    Never raises errors to the caller.
    """
    # Reject page_view and whatsapp_click — those have dedicated endpoints
    excluded = {"page_view", "whatsapp_click"}
    if body.event_type not in analytics_service.VALID_EVENT_TYPES or body.event_type in excluded:
        return {"success": False}

    page = await page_service.get_public_page_by_slug(db, slug)
    if page is None:
        return {"success": False}

    await analytics_service.track_event(db, page.id, body.event_type, request)
    return {"success": True}


# ──────────────────────────── Upload ────────────────────────────


@router.post("/upload/logo", response_model=UploadResponse)
async def upload_logo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
) -> UploadResponse:
    """Upload a business logo image to Cloudinary."""
    url = await upload_service.upload_logo(file)
    return UploadResponse(logo_url=url)


@router.post("/upload/banner")
async def upload_banner(
    file: UploadFile = File(...),
    slug: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    """Upload and save a banner image for an owned page."""
    page_query = select(BusinessPage).where(
        BusinessPage.slug == slug,
        BusinessPage.user_id == current_user.id,
    )
    result = await db.execute(page_query)
    page = result.scalars().first()
    if page is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Page not found or not owned by current user.",
        )

    banner_url = await upload_service.upload_banner_image(file, slug)
    page.banner_image_url = banner_url
    await db.commit()
    await db.refresh(page)

    return {
        "banner_url": banner_url,
        "message": "Banner uploaded successfully",
    }


@router.post("/upload/product-image")
async def upload_product_image(
    file: UploadFile = File(...),
    page_id: str = Form(...),
    product_index: int = Form(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict[str, str | int]:
    """Upload and set an image for a product entry in products JSONB."""
    if product_index < 0 or product_index > 9:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="product_index must be between 0 and 9",
        )

    try:
        parsed_page_id = uuid.UUID(page_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="page_id must be a valid UUID",
        ) from exc

    page = await page_service.get_user_page_by_id(db, parsed_page_id, current_user.id)
    if page is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Page not found or not owned by current user.",
        )

    image_url = await upload_service.upload_product_image(file, page.slug, product_index)

    products = deepcopy(page.products) if page.products else []
    if not isinstance(products, list):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Products data must be a list.",
        )

    if product_index >= len(products):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product index out of range",
        )

    if not isinstance(products[product_index], dict):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product entry is invalid.",
        )

    products[product_index]["image_url"] = image_url
    page.products = products
    await db.commit()
    await db.refresh(page)

    return {
        "image_url": image_url,
        "product_index": product_index,
    }
