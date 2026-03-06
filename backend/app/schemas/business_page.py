"""Pydantic schemas for business page requests and responses."""

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


# ---------- Shared ----------


class ProductItem(BaseModel):
    """Single product / service offered by the business."""

    name: str
    price: str
    description: str | None = None


# ---------- Request schemas ----------


class PageCreate(BaseModel):
    """Schema for creating a new business page."""

    business_name: str = Field(..., min_length=1, max_length=255)
    category: str = Field(..., min_length=1, max_length=100)
    whatsapp_number: str = Field(..., min_length=6, max_length=20)
    location: str | None = None
    products: list[ProductItem] | None = None
    theme: str = Field(default="default")


class PageUpdate(BaseModel):
    """Schema for partially updating a business page."""

    business_name: str | None = None
    category: str | None = None
    whatsapp_number: str | None = None
    location: str | None = None
    products: list[ProductItem] | None = None
    theme: str | None = None
    logo_url: str | None = None
    ai_headline: str | None = None
    ai_subheadline: str | None = None
    ai_about: str | None = None
    ai_cta_text: str | None = None
    ai_products: list[dict[str, Any]] | None = None
    seo_title: str | None = None
    seo_description: str | None = None


# ---------- AI ----------


class AIGenerateRequest(BaseModel):
    """Input for the standalone AI content generation endpoint."""

    business_name: str
    category: str
    products: list[ProductItem] | None = None
    location: str | None = None


class AIGenerateResponse(BaseModel):
    """AI-generated marketing content."""

    headline: str
    subheadline: str
    about: str
    cta_text: str
    products: list[dict[str, Any]] | None = None
    seo_title: str
    seo_description: str


# ---------- Response schemas ----------


class PageResponse(BaseModel):
    """Full business page representation returned by the API."""

    id: uuid.UUID
    user_id: uuid.UUID
    slug: str
    business_name: str
    category: str
    whatsapp_number: str
    location: str | None
    logo_url: str | None
    products: Any | None
    ai_headline: str | None
    ai_subheadline: str | None
    ai_about: str | None
    ai_cta_text: str | None
    ai_products: Any | None
    seo_title: str | None
    seo_description: str | None
    theme: str
    is_active: bool
    is_ai_generated: bool
    page_views: int
    whatsapp_clicks: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PublicPageResponse(BaseModel):
    """Slimmed-down page data for public visitors (no user_id)."""

    id: uuid.UUID
    slug: str
    business_name: str
    category: str
    whatsapp_number: str
    location: str | None
    logo_url: str | None
    products: Any | None
    ai_headline: str | None
    ai_subheadline: str | None
    ai_about: str | None
    ai_cta_text: str | None
    ai_products: Any | None
    seo_title: str | None
    seo_description: str | None
    theme: str
    page_views: int
    whatsapp_clicks: int
    created_at: datetime

    model_config = {"from_attributes": True}


class UploadResponse(BaseModel):
    """Response after uploading a logo image."""

    logo_url: str
