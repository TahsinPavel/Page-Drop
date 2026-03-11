"""Pydantic schemas for user-related requests and responses."""

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, model_validator


# ---------- Request schemas ----------


class UserCreate(BaseModel):
    """Schema for user registration."""

    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str | None = None


class UserUpdate(BaseModel):
    """Schema for updating user profile (full_name only)."""

    full_name: str | None = None


class LoginRequest(BaseModel):
    """Schema for login when not using OAuth2 form."""

    email: EmailStr
    password: str


# ---------- Response schemas ----------


class UserResponse(BaseModel):
    """Public user representation returned by the API."""

    id: uuid.UUID
    email: str
    full_name: str | None
    plan: str = "free"
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    """JWT access token response."""

    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class SubscriptionStatus(BaseModel):
    """Subscription details for the current user."""

    plan: str
    status: str
    payment_provider: Optional[str] = None
    current_period_end: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    is_pro: bool = False

    @model_validator(mode="after")
    def compute_is_pro(self) -> "SubscriptionStatus":
        """Set ``is_pro`` based on plan value."""
        self.is_pro = self.plan in ("pro", "business")
        return self
