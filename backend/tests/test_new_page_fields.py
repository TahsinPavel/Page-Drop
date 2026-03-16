"""
Verification tests for new business page fields.
Tests that new columns exist and work correctly.
Run with: pytest tests/test_new_page_fields.py -v
"""

import json

import pytest
import pytest_asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from app.config import settings


@pytest_asyncio.fixture
async def engine():
    db_engine = create_async_engine(settings.DATABASE_URL, echo=False)
    yield db_engine
    await db_engine.dispose()


@pytest_asyncio.fixture
async def db_columns(engine):
    async with engine.connect() as conn:
        result = await conn.execute(
            text(
                """
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_schema = 'public'
                AND table_name = 'business_pages'
                ORDER BY ordinal_position
                """
            )
        )
        rows = result.fetchall()

    return {
        row[0]: {
            "type": row[1],
            "nullable": row[2] == "YES",
            "default": row[3],
        }
        for row in rows
    }


# Column existence tests


@pytest.mark.asyncio
async def test_banner_image_url_column_exists(db_columns):
    assert "banner_image_url" in db_columns, (
        "banner_image_url column missing from business_pages"
    )


@pytest.mark.asyncio
async def test_phone_number_column_exists(db_columns):
    assert "phone_number" in db_columns, (
        "phone_number column missing from business_pages"
    )


@pytest.mark.asyncio
async def test_business_hours_column_exists(db_columns):
    assert "business_hours" in db_columns, (
        "business_hours column missing from business_pages"
    )


@pytest.mark.asyncio
async def test_is_online_only_column_exists(db_columns):
    assert "is_online_only" in db_columns, (
        "is_online_only column missing from business_pages"
    )


# Column type tests


@pytest.mark.asyncio
async def test_banner_image_url_is_varchar(db_columns):
    col = db_columns["banner_image_url"]
    assert "char" in col["type"].lower(), (
        f"banner_image_url should be VARCHAR, got: {col['type']}"
    )


@pytest.mark.asyncio
async def test_business_hours_is_jsonb(db_columns):
    col = db_columns["business_hours"]
    assert "json" in col["type"].lower(), (
        f"business_hours should be JSONB, got: {col['type']}"
    )


@pytest.mark.asyncio
async def test_is_online_only_is_boolean(db_columns):
    col = db_columns["is_online_only"]
    assert col["type"] in ("boolean", "bool"), (
        f"is_online_only should be BOOLEAN, got: {col['type']}"
    )


# Nullable tests


@pytest.mark.asyncio
async def test_nullable_columns(db_columns):
    """These new columns must be nullable."""
    for col_name in [
        "banner_image_url",
        "phone_number",
        "business_hours",
    ]:
        col = db_columns[col_name]
        assert col["nullable"] is True, f"{col_name} should be nullable"


@pytest.mark.asyncio
async def test_is_online_only_not_nullable(db_columns):
    col = db_columns["is_online_only"]
    assert col["nullable"] is False, "is_online_only should NOT be nullable"


@pytest.mark.asyncio
async def test_is_online_only_default_true(db_columns):
    col = db_columns["is_online_only"]
    assert col["default"] is not None, "is_online_only should have a default value"
    assert "true" in str(col["default"]).lower(), (
        f"is_online_only default should be true, got: {col['default']}"
    )


# Schema validation tests


def test_page_create_schema_accepts_new_fields():
    """PageCreate schema should accept all new fields."""
    from app.schemas.business_page import PageCreate

    page = PageCreate(
        business_name="Test Shop",
        category="restaurant",
        whatsapp_number="+8801712345678",
        banner_image_url="https://example.com/banner.jpg",
        phone_number="+8801712345678",
        is_online_only=False,
        business_hours={
            "monday": {"open": "09:00", "close": "22:00", "closed": False}
        },
    )
    assert page.banner_image_url == "https://example.com/banner.jpg"
    assert page.is_online_only is False
    assert page.business_hours is not None


def test_page_create_defaults_to_online_only():
    """is_online_only should default to True."""
    from app.schemas.business_page import PageCreate

    page = PageCreate(
        business_name="Test Shop",
        category="restaurant",
        whatsapp_number="+8801712345678",
    )
    assert page.is_online_only is True


def test_phone_validation_accepts_valid_number():
    """Valid international phone numbers should pass."""
    from app.schemas.business_page import PageCreate

    page = PageCreate(
        business_name="Test",
        category="restaurant",
        whatsapp_number="+8801712345678",
        phone_number="+8801712345678",
    )
    assert page.phone_number == "+8801712345678"


def test_phone_validation_rejects_invalid_number():
    """Invalid phone numbers should raise ValueError."""
    from pydantic import ValidationError

    from app.schemas.business_page import PageCreate

    with pytest.raises(ValidationError):
        PageCreate(
            business_name="Test",
            category="restaurant",
            whatsapp_number="+8801712345678",
            phone_number="not-a-phone",
        )


def test_phone_validation_accepts_none():
    """Phone number is optional. None should be accepted."""
    from app.schemas.business_page import PageCreate

    page = PageCreate(
        business_name="Test",
        category="restaurant",
        whatsapp_number="+8801712345678",
        phone_number=None,
    )
    assert page.phone_number is None


def test_business_hours_validation_rejects_invalid_structure():
    """Invalid business hours structure should raise ValueError."""
    from pydantic import ValidationError

    from app.schemas.business_page import PageCreate

    with pytest.raises(ValidationError):
        PageCreate(
            business_name="Test",
            category="restaurant",
            whatsapp_number="+8801712345678",
            business_hours={"monday": "not-a-dict"},
        )


# Smoke test


@pytest.mark.asyncio
async def test_can_store_and_retrieve_business_hours(engine):
    """
    Verify JSONB business_hours can be stored and retrieved.
    Updates a test row, reads it back, then resets.
    Skips if no existing page to update.
    """
    async with engine.begin() as conn:
        result = await conn.execute(text("SELECT id FROM business_pages LIMIT 1"))
        row = result.fetchone()
        if not row:
            pytest.skip("No business pages in DB. Skipping smoke test")

        page_id = row[0]
        test_hours = {
            "monday": {"open": "09:00", "close": "22:00", "closed": False},
            "sunday": {"open": "00:00", "close": "00:00", "closed": True},
        }

        await conn.execute(
            text(
                """
                UPDATE business_pages
                SET business_hours = CAST(:hours AS jsonb)
                WHERE id = :id
                """
            ),
            {
                "hours": json.dumps(test_hours),
                "id": page_id,
            },
        )

        result = await conn.execute(
            text("SELECT business_hours FROM business_pages WHERE id = :id"),
            {"id": page_id},
        )
        stored = result.fetchone()
        assert stored is not None
        assert stored[0] is not None

        await conn.execute(
            text(
                """
                UPDATE business_pages
                SET business_hours = NULL
                WHERE id = :id
                """
            ),
            {"id": page_id},
        )
