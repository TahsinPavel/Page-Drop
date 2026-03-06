"""Pages router — CRUD, public access, analytics, regeneration, and logo upload."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.business_page import (
    PageCreate,
    PageResponse,
    PageUpdate,
    PublicPageResponse,
    UploadResponse,
)
from app.services import ai_service, page_service, upload_service

router = APIRouter(prefix="/pages", tags=["Pages"])


# ──────────────────────────── Protected routes ────────────────────────────


@router.post("/", response_model=PageResponse, status_code=status.HTTP_201_CREATED)
async def create_page(
    body: PageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PageResponse:
    """Create a new business page and auto-generate AI content."""
    page = await page_service.create_page(db, body, current_user.id)

    # Trigger AI generation in the background-ish (still awaited for this request)
    products = [p.model_dump() for p in body.products] if body.products else None
    ai_data = await ai_service.generate_content(
        business_name=body.business_name,
        category=body.category,
        products=products,
        location=body.location,
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
    )
    page = await page_service.apply_ai_content(db, page, ai_data)
    return PageResponse.model_validate(page)


# ──────────────────────────── Public routes ────────────────────────────


@router.get("/public/{slug}", response_model=PublicPageResponse)
async def get_public_page(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> PublicPageResponse:
    """Return a public business page by slug and increment view count."""
    page = await page_service.get_public_page_by_slug(db, slug)
    if page is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found.")

    await page_service.increment_page_views(db, page.id)
    # Refresh to get updated counter
    await db.refresh(page)

    return PublicPageResponse.model_validate(page)


@router.post("/public/{slug}/whatsapp-click")
async def track_whatsapp_click(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Increment the WhatsApp click counter for a page."""
    page = await page_service.get_public_page_by_slug(db, slug)
    if page is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found.")

    await page_service.increment_whatsapp_clicks(db, page.id)
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
