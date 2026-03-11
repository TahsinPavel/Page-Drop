"""SQLAlchemy model for the subscriptions table."""

import uuid

from sqlalchemy import (
    Column, String, Boolean, DateTime, ForeignKey, Text
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func, text

from app.database import Base


class Subscription(Base):
    """User subscription / plan record (one-to-one with User)."""

    __tablename__ = "subscriptions"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
        nullable=False,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    plan = Column(
        String(20),
        nullable=False,
        default="free",
        server_default="free",
    )
    status = Column(
        String(20),
        nullable=False,
        default="active",
        server_default="active",
    )
    payment_provider = Column(
        String(30),
        nullable=True,
    )
    provider_sub_id = Column(
        String(255),
        nullable=True,
    )
    current_period_start = Column(
        DateTime(timezone=True),
        nullable=True,
    )
    current_period_end = Column(
        DateTime(timezone=True),
        nullable=True,
    )
    cancelled_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationships
    user = relationship("User", back_populates="subscription")
