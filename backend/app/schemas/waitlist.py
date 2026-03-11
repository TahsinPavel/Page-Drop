"""Pydantic schemas for the waitlist feature."""

from pydantic import BaseModel, EmailStr, field_validator


class WaitlistJoin(BaseModel):
    """Schema for joining the paid-plan waitlist."""

    email: EmailStr
    plan_interest: str

    @field_validator("plan_interest")
    @classmethod
    def validate_plan(cls, v: str) -> str:
        if v not in ("pro", "business"):
            raise ValueError("plan_interest must be 'pro' or 'business'")
        return v


class WaitlistResponse(BaseModel):
    """Generic success response after joining the waitlist."""

    success: bool
    message: str


class WaitlistCountResponse(BaseModel):
    """Current waitlist counts by plan interest."""

    pro_count: int
    business_count: int
    total: int
