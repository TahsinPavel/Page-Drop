"""SQLAlchemy model for the business_pages table."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class BusinessPage(Base):
    """A hosted landing page for a small business."""

    __tablename__ = "business_pages"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    business_name: Mapped[str] = mapped_column(String, nullable=False)
    category: Mapped[str] = mapped_column(String, nullable=False)
    whatsapp_number: Mapped[str] = mapped_column(String, nullable=False)
    location: Mapped[str | None] = mapped_column(String, nullable=True)
    logo_url: Mapped[str | None] = mapped_column(String, nullable=True)

    # User-supplied product list
    products: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    # AI-generated content
    ai_headline: Mapped[str | None] = mapped_column(String, nullable=True)
    ai_subheadline: Mapped[str | None] = mapped_column(String, nullable=True)
    ai_about: Mapped[str | None] = mapped_column(Text, nullable=True)
    ai_cta_text: Mapped[str | None] = mapped_column(String, nullable=True)
    ai_products: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    # SEO
    seo_title: Mapped[str | None] = mapped_column(String, nullable=True)
    seo_description: Mapped[str | None] = mapped_column(String(160), nullable=True)

    # Display / analytics
    theme: Mapped[str] = mapped_column(String, default="default")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_ai_generated: Mapped[bool] = mapped_column(Boolean, default=False)
    page_views: Mapped[int] = mapped_column(Integer, default=0)
    whatsapp_clicks: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    owner = relationship("User", back_populates="pages")
    analytics = relationship(
        "PageAnalytic", back_populates="page", cascade="all, delete-orphan"
    )
