"""Cloudinary image upload service for business logos."""

import logging

import cloudinary
import cloudinary.uploader
from fastapi import HTTPException, UploadFile, status

from app.config import settings

logger = logging.getLogger(__name__)

# Configure Cloudinary SDK once at module level
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 2 * 1024 * 1024  # 2 MB


async def upload_logo(file: UploadFile) -> str:
    """Validate and upload an image file to Cloudinary.

    Args:
        file: The ``UploadFile`` from FastAPI's multipart form handler.

    Returns:
        The secure Cloudinary URL of the uploaded image.

    Raises:
        HTTPException: If the file type is unsupported or exceeds the size limit.
    """
    # Validate content type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid file type. Only JPG, PNG, and WebP images are allowed.",
        )

    # Read file and validate size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="File size exceeds the 2 MB limit.",
        )

    try:
        result = cloudinary.uploader.upload(
            contents,
            folder="pagedrop/logos",
            resource_type="image",
            transformation=[{"width": 400, "height": 400, "crop": "limit"}],
        )
        return result["secure_url"]
    except Exception as exc:
        logger.error("Cloudinary upload failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Image upload failed. Please try again.",
        ) from exc
