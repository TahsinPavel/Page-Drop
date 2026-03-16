"""CRUD operations and business logic for business pages."""

import re
import uuid

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.business_page import BusinessPage
from app.schemas.business_page import PageCreate, PageUpdate


def _slugify(text: str) -> str:
    """Convert arbitrary text into a URL-friendly slug.

    Example: ``"Ahmed's Biryani House!"`` → ``"ahmeds-biryani-house"``
    """
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return re.sub(r"-+", "-", text).strip("-")


async def generate_unique_slug(db: AsyncSession, business_name: str) -> str:
    """Generate a slug from ``business_name``, appending a number if it already exists.

    Args:
        db: Async database session.
        business_name: Raw business name from the user.

    Returns:
        A unique slug string guaranteed not to collide with existing rows.
    """
    base_slug = _slugify(business_name)
    slug = base_slug
    counter = 1

    while True:
        result = await db.execute(select(BusinessPage).where(BusinessPage.slug == slug))
        if result.scalars().first() is None:
            return slug
        slug = f"{base_slug}-{counter}"
        counter += 1


async def create_page(
    db: AsyncSession, page_data: PageCreate, user_id: uuid.UUID
) -> BusinessPage:
    """Create a new business page and persist it.

    Args:
        db: Async database session.
        page_data: Validated page creation data.
        user_id: UUID of the owning user.

    Returns:
        The newly created ``BusinessPage`` instance.
    """
    slug = await generate_unique_slug(db, page_data.business_name)

    page = BusinessPage(
        user_id=user_id,
        slug=slug,
        business_name=page_data.business_name,
        category=page_data.category,
        whatsapp_number=page_data.whatsapp_number,
        location=page_data.location,
        banner_image_url=page_data.banner_image_url,
        phone_number=page_data.phone_number,
        business_hours=page_data.business_hours,
        is_online_only=page_data.is_online_only,
        products=[p.model_dump() for p in page_data.products] if page_data.products else None,
        theme=page_data.theme,
    )
    db.add(page)
    await db.flush()
    await db.refresh(page)
    return page


async def get_user_pages(db: AsyncSession, user_id: uuid.UUID) -> list[BusinessPage]:
    """Return all active pages belonging to a user.

    Args:
        db: Async database session.
        user_id: UUID of the owning user.

    Returns:
        A list of ``BusinessPage`` instances.
    """
    result = await db.execute(
        select(BusinessPage)
        .where(BusinessPage.user_id == user_id)
        .order_by(BusinessPage.created_at.desc())
    )
    return list(result.scalars().all())


async def get_user_page_by_id(
    db: AsyncSession, page_id: uuid.UUID, user_id: uuid.UUID
) -> BusinessPage | None:
    """Fetch a single page owned by the given user.

    Returns:
        The page if found, otherwise ``None``.
    """
    result = await db.execute(
        select(BusinessPage).where(
            BusinessPage.id == page_id, BusinessPage.user_id == user_id
        )
    )
    return result.scalars().first()


async def update_page(
    db: AsyncSession, page: BusinessPage, page_data: PageUpdate
) -> BusinessPage:
    """Apply partial updates to an existing page.

    Args:
        db: Async database session.
        page: The page instance to update.
        page_data: Validated update payload (only set fields are applied).

    Returns:
        The updated ``BusinessPage`` instance.
    """
    update_dict = page_data.model_dump(exclude_unset=True)

    # Serialize products if present
    if "products" in update_dict and update_dict["products"] is not None:
        update_dict["products"] = [
            p.model_dump() if hasattr(p, "model_dump") else p
            for p in update_dict["products"]
        ]

    if page_data.banner_image_url is not None:
        page.banner_image_url = page_data.banner_image_url
        update_dict.pop("banner_image_url", None)
    if page_data.phone_number is not None:
        page.phone_number = page_data.phone_number
        update_dict.pop("phone_number", None)
    if page_data.business_hours is not None:
        page.business_hours = page_data.business_hours
        update_dict.pop("business_hours", None)
    if page_data.is_online_only is not None:
        page.is_online_only = page_data.is_online_only
        update_dict.pop("is_online_only", None)

    for field, value in update_dict.items():
        setattr(page, field, value)

    await db.flush()
    await db.refresh(page)
    return page


async def soft_delete_page(db: AsyncSession, page: BusinessPage) -> BusinessPage:
    """Soft-delete a page by setting ``is_active = False``.

    Returns:
        The updated page.
    """
    page.is_active = False
    await db.flush()
    await db.refresh(page)
    return page


async def get_public_page_by_slug(db: AsyncSession, slug: str) -> BusinessPage | None:
    """Fetch an active page by its public slug.

    Returns:
        The page if found and active, otherwise ``None``.
    """
    result = await db.execute(
        select(BusinessPage).where(
            BusinessPage.slug == slug, BusinessPage.is_active == True  # noqa: E712
        )
    )
    return result.scalars().first()


async def increment_page_views(db: AsyncSession, page_id: uuid.UUID) -> None:
    """Atomically increment the ``page_views`` counter by 1."""
    await db.execute(
        update(BusinessPage)
        .where(BusinessPage.id == page_id)
        .values(page_views=BusinessPage.page_views + 1)
    )
    await db.flush()


async def increment_whatsapp_clicks(db: AsyncSession, page_id: uuid.UUID) -> None:
    """Atomically increment the ``whatsapp_clicks`` counter by 1."""
    await db.execute(
        update(BusinessPage)
        .where(BusinessPage.id == page_id)
        .values(whatsapp_clicks=BusinessPage.whatsapp_clicks + 1)
    )
    await db.flush()


async def apply_ai_content(
    db: AsyncSession, page: BusinessPage, ai_data: dict
) -> BusinessPage:
    """Write AI-generated content fields onto the page.

    Args:
        db: Async database session.
        page: The page instance to update.
        ai_data: Dict with keys ``headline``, ``subheadline``, ``about``, etc.

    Returns:
        The updated ``BusinessPage`` with AI content applied.
    """
    page.ai_headline = ai_data.get("headline")
    page.ai_subheadline = ai_data.get("subheadline")
    page.ai_about = ai_data.get("about")
    page.ai_cta_text = ai_data.get("cta_text")
    page.ai_products = ai_data.get("products")
    page.seo_title = ai_data.get("seo_title")
    page.seo_description = ai_data.get("seo_description")
    page.is_ai_generated = True

    await db.flush()
    await db.refresh(page)
    return page
