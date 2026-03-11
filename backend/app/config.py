"""Application configuration loaded from environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Global application settings.

    All values are read from environment variables (or a `.env` file).
    """

    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7

    GEMINI_API_KEY: str = ""

    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # Gumroad
    gumroad_webhook_secret: str = ""
    gumroad_pro_permalink: str = "pagedrop-pro"
    gumroad_business_permalink: str = "pagedrop-business"

    # NOWPayments
    nowpayments_api_key: str = ""
    nowpayments_ipn_secret: str = ""
    nowpayments_pro_amount: float = 12.00
    nowpayments_business_amount: float = 29.00

    # Frontend URL (for redirect after payment)
    frontend_url: str = "http://localhost:3000"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()  # type: ignore[call-arg]
