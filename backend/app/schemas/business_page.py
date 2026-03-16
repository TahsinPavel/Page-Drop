"""Pydantic schemas for business page requests and responses."""

import re
import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, field_validator


# ---------- Shared ----------


class ProductItem(BaseModel):
    """Single product / service offered by the business."""

    name: str
    price: str
    description: str | None = None
    image_url: str | None = None


class BusinessHoursDay(BaseModel):
    """A single day's opening hours."""

    open: str | None = "00:00"
    close: str | None = "00:00"
    closed: bool = False


class BusinessHours(BaseModel):
    """Weekly business-hours map."""

    monday: BusinessHoursDay | None = None
    tuesday: BusinessHoursDay | None = None
    wednesday: BusinessHoursDay | None = None
    thursday: BusinessHoursDay | None = None
    friday: BusinessHoursDay | None = None
    saturday: BusinessHoursDay | None = None
    sunday: BusinessHoursDay | None = None


# ---------- Request schemas ----------


class PageCreate(BaseModel):
    """Schema for creating a new business page."""

    business_name: str = Field(..., min_length=1, max_length=255)
    category: str = Field(..., min_length=1, max_length=100)
    whatsapp_number: str = Field(..., min_length=6, max_length=20)
    location: str | None = None
    banner_image_url: str | None = None
    phone_number: str | None = None
    business_hours: dict[str, Any] | None = None
    is_online_only: bool = True
    products: list[ProductItem] | None = None
    theme: str = Field(default="default")

    @field_validator("phone_number")
    @classmethod
    def validate_phone(cls, value: str | None) -> str | None:
        if value is None:
            return value
        cleaned = value.replace(" ", "").replace("-", "")
        if not re.match(r"^\+\d{7,15}$", cleaned):
            raise ValueError(
                "Phone number must be in international format e.g. +8801712345678"
            )
        return cleaned

    @field_validator("business_hours")
    @classmethod
    def validate_hours(cls, value: dict[str, Any] | None) -> dict[str, Any] | None:
        if value is None:
            return value

        days = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ]

        for day in days:
            if day in value:
                day_data = value[day]
                if not isinstance(day_data, dict):
                    raise ValueError(f"{day} must be a dict")
                if "closed" not in day_data:
                    raise ValueError(f"{day} must have closed field")
                if not day_data.get("closed", False):
                    if "open" not in day_data or "close" not in day_data:
                        raise ValueError(
                            f"{day} must have open and close times when not closed"
                        )
        return value


class PageUpdate(BaseModel):
    """Schema for partially updating a business page."""

    business_name: str | None = None
    category: str | None = None
    whatsapp_number: str | None = None
    location: str | None = None
    banner_image_url: str | None = None
    phone_number: str | None = None
    business_hours: dict[str, Any] | None = None
    is_online_only: bool | None = None
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

    @field_validator("phone_number")
    @classmethod
    def validate_phone(cls, value: str | None) -> str | None:
        if value is None:
            return value
        cleaned = value.replace(" ", "").replace("-", "")
        if not re.match(r"^\+\d{7,15}$", cleaned):
            raise ValueError(
                "Phone number must be in international format e.g. +8801712345678"
            )
        return cleaned

    @field_validator("business_hours")
    @classmethod
    def validate_hours(cls, value: dict[str, Any] | None) -> dict[str, Any] | None:
        if value is None:
            return value

        days = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ]

        for day in days:
            if day in value:
                day_data = value[day]
                if not isinstance(day_data, dict):
                    raise ValueError(f"{day} must be a dict")
                if "closed" not in day_data:
                    raise ValueError(f"{day} must have closed field")
                if not day_data.get("closed", False):
                    if "open" not in day_data or "close" not in day_data:
                        raise ValueError(
                            f"{day} must have open and close times when not closed"
                        )
        return value


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
    banner_image_url: str | None = None
    phone_number: str | None = None
    business_hours: dict[str, Any] | None = None
    is_online_only: bool = True
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


# ---------- Analytics ----------


class DayAnalytics(BaseModel):
    """Daily views and clicks for a page."""

    date: str
    views: int
    clicks: int


class ReferrerAnalytics(BaseModel):
    """A single referrer entry."""

    referrer: str
    count: int


class BestDay(BaseModel):
    """The day with the highest page views."""

    date: str
    views: int


class PageAnalyticsResponse(BaseModel):
    """Full analytics breakdown for a single page."""

    total_views: int
    total_whatsapp_clicks: int
    total_product_clicks: int
    click_through_rate: float
    views_by_day: list[DayAnalytics]
    top_referrers: list[ReferrerAnalytics]
    views_last_7_days: int
    views_last_30_days: int
    best_day: BestDay | None


class DashboardSummaryResponse(BaseModel):
    """Aggregated analytics across all of a user's pages."""

    total_pages: int
    total_views_all_time: int
    total_whatsapp_clicks_all_time: int
    total_views_last_30_days: int
    best_performing_page: dict | None
