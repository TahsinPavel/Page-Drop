"""AI router — standalone content generation endpoint."""

from fastapi import APIRouter, Depends

from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.business_page import AIGenerateRequest, AIGenerateResponse
from app.services import ai_service

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/generate", response_model=AIGenerateResponse)
async def generate_content(
    body: AIGenerateRequest,
    current_user: User = Depends(get_current_user),
) -> AIGenerateResponse:
    """Generate AI marketing content without creating a page.

    Useful for previewing AI output before committing to a page.
    """
    products = [p.model_dump() for p in body.products] if body.products else None
    result = await ai_service.generate_content(
        business_name=body.business_name,
        category=body.category,
        products=products,
        location=body.location,
    )
    return AIGenerateResponse(**result)
