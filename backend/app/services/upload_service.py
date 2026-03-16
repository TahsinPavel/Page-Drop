"""Cloudinary image upload service for business logos."""

import asyncio
import logging
import time

import cloudinary
import cloudinary.uploader
from fastapi import HTTPException, UploadFile, status

from app.config import settings

logger = logging.getLogger(__name__)

_CLOUDINARY_CLOUD_NAME_RAW = (settings.CLOUDINARY_CLOUD_NAME or "").strip()
_CLOUDINARY_CLOUD_NAME_LOWER = _CLOUDINARY_CLOUD_NAME_RAW.lower()
_CLOUDINARY_API_KEY = (settings.CLOUDINARY_API_KEY or "").strip()
_CLOUDINARY_API_SECRET = (settings.CLOUDINARY_API_SECRET or "").strip()

# Configure Cloudinary SDK once at module level
cloudinary.config(
    cloud_name=_CLOUDINARY_CLOUD_NAME_RAW,
    api_key=_CLOUDINARY_API_KEY,
    api_secret=_CLOUDINARY_API_SECRET,
    secure=True,
)

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 2 * 1024 * 1024  # 2 MB
_CLOUDINARY_UPLOAD_LOCK = asyncio.Lock()


def _is_cloudinary_configured() -> bool:
    return bool(
        _CLOUDINARY_CLOUD_NAME_RAW
        and _CLOUDINARY_API_KEY
        and _CLOUDINARY_API_SECRET
    )


async def _upload_to_cloudinary(contents: bytes, **options: object) -> dict:
    """Upload to Cloudinary with explicit credentials and serialized SDK access.

    Cloudinary's Python SDK uses global config state internally. Serializing calls
    and passing credentials per call avoids cross-request state issues under
    concurrent uploads.
    """
    candidate_cloud_names: list[str] = []
    for value in (_CLOUDINARY_CLOUD_NAME_RAW, _CLOUDINARY_CLOUD_NAME_LOWER):
        if value and value not in candidate_cloud_names:
            candidate_cloud_names.append(value)

    last_error: Exception | None = None
    async with _CLOUDINARY_UPLOAD_LOCK:
        for cloud_name in candidate_cloud_names:
            try:
                return cloudinary.uploader.upload(
                    contents,
                    cloud_name=cloud_name,
                    api_key=_CLOUDINARY_API_KEY,
                    api_secret=_CLOUDINARY_API_SECRET,
                    **options,
                )
            except Exception as exc:  # pragma: no cover - third-party SDK error path
                last_error = exc
                message = str(exc)
                if "Invalid cloud_name" in message:
                    continue
                raise

    if last_error is not None:
        raise last_error

    raise RuntimeError("Cloudinary upload failed before request execution.")


def _raise_cloudinary_http_error(exc: Exception) -> None:
    message = str(exc)
    if "Invalid cloud_name" in message:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Cloudinary cloud name is invalid. Set CLOUDINARY_CLOUD_NAME to the actual "
                "Cloudinary cloud name from your dashboard URL (not key name/environment label)."
            ),
        ) from exc

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Image upload failed. Please try again.",
    ) from exc


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
        result = await _upload_to_cloudinary(
            contents,
            folder="pagedrop/logos",
            resource_type="image",
            transformation=[{"width": 400, "height": 400, "crop": "limit"}],
        )
        return result["secure_url"]
    except Exception as exc:
        logger.error("Cloudinary upload failed: %s", exc)
        _raise_cloudinary_http_error(exc)


async def upload_product_image(
    file: UploadFile,
    business_slug: str,
    product_index: int,
) -> str:
    """Upload a product image to Cloudinary."""
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only JPG, PNG, and WebP images are allowed.",
        )

    contents = await file.read()
    if len(contents) > 3 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the 3 MB limit.",
        )

    if not _is_cloudinary_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Image upload not configured. Please add Cloudinary credentials.",
        )

    timestamp = int(time.time())
    try:
        result = await _upload_to_cloudinary(
            contents,
            folder=f"pagedrop/products/{business_slug}",
            public_id=f"product_{product_index}_{timestamp}",
            resource_type="image",
            transformation=[
                {
                    "width": 800,
                    "height": 800,
                    "crop": "limit",
                    "quality": "auto",
                    "fetch_format": "auto",
                }
            ],
            eager=[
                {
                    "width": 800,
                    "height": 800,
                    "crop": "limit",
                    "quality": "auto",
                    "fetch_format": "auto",
                }
            ],
        )
        return result["secure_url"]
    except Exception as exc:
        logger.error("Cloudinary product image upload failed: %s", exc)
        _raise_cloudinary_http_error(exc)


async def upload_banner_image(file: UploadFile, business_slug: str) -> str:
    """Upload a banner/hero image to Cloudinary."""
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only JPG, PNG, and WebP images are allowed.",
        )

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the 5 MB limit.",
        )

    if not _is_cloudinary_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Image upload not configured.",
        )

    timestamp = int(time.time())
    try:
        result = await _upload_to_cloudinary(
            contents,
            folder="pagedrop/banners",
            public_id=f"banner_{business_slug}_{timestamp}",
            resource_type="image",
            transformation=[
                {
                    "width": 1200,
                    "height": 400,
                    "crop": "fill",
                    "gravity": "auto",
                    "quality": "auto",
                    "fetch_format": "auto",
                }
            ],
        )
        return result["secure_url"]
    except Exception as exc:
        logger.error("Cloudinary banner image upload failed: %s", exc)
        _raise_cloudinary_http_error(exc)
