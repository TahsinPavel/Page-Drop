"""SQLAlchemy model for the payment_events table."""

import uuid

from sqlalchemy import (
    Column, String, Boolean, DateTime,
    Integer, ForeignKey, Text
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func, text

from app.database import Base


class PaymentEvent(Base):
    """Immutable log of every payment-related webhook / event."""

    __tablename__ = "payment_events"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
        nullable=False,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    payment_provider = Column(
        String(30),
        nullable=False,
        index=True,
    )
    event_type = Column(
        String(50),
        nullable=False,
        index=True,
    )
    provider_sale_id = Column(
        String(255),
        nullable=True,
        index=True,
    )
    amount = Column(
        Integer,
        nullable=True,
    )
    currency = Column(
        String(10),
        nullable=True,
        default="USD",
    )
    plan = Column(
        String(20),
        nullable=True,
    )
    raw_payload = Column(
        JSONB,
        nullable=True,
    )
    is_test = Column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
    )
    processed = Column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
    )
    error_message = Column(
        Text,
        nullable=True,
    )
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True,
    )

    # Relationships
    user = relationship("User", back_populates="payment_events")
