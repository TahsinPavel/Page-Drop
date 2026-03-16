"""Google Gemini 2.0 Flash integration for AI content generation."""

import asyncio
import json
import logging
from typing import Any

import google.generativeai as genai

from app.config import settings

logger = logging.getLogger(__name__)

# Configure the SDK once at module level
genai.configure(api_key=settings.GEMINI_API_KEY)

_MODEL_NAME = "gemini-2.0-flash"


def _build_prompt(
    business_name: str,
    category: str,
    products: list[dict[str, Any]] | None = None,
    location: str | None = None,
    phone_number: str | None = None,
    business_hours: dict[str, Any] | None = None,
    is_online_only: bool = True,
) -> str:
    """Build the marketing-copy prompt for Gemini.

    The prompt asks the model to return **only** raw valid JSON (no markdown
    fences) with specific keys so we can parse it deterministically.
    """
    product_text = ""
    if products:
        items = ", ".join(
            f'{p.get("name", "Item")} ({p.get("price", "N/A")})'
            for p in products
        )
        product_text = f"\nProducts/services offered: {items}"

    location_text = f"\nLocation: {location}" if location else ""

    phone_section = ""
    if phone_number:
        phone_section = f"Phone: {phone_number}"

    hours_note = ""
    if is_online_only:
        hours_note = "This is an online-only business."
    elif business_hours:
        hours_note = "This business has physical operating hours."

    return f"""You are an expert copywriter for small local businesses.
Generate marketing content for the following business.  The tone must be
warm, inviting, human, and locally relevant — never generic or robotic.

Business name: {business_name}
Category: {category}{product_text}{location_text}

Additional context:
{phone_section}
{hours_note}

Important: If this is an online-only business,
do NOT mention visiting in person or physical location
in any generated content. Focus on WhatsApp ordering/contact.
If this has a physical location, you may mention visiting.

Return ONLY raw valid JSON (no markdown, no code fences, no extra text).
The JSON must have exactly these keys:
{{
  "headline": "A catchy headline (max 80 chars)",
  "subheadline": "A supporting subheadline (max 120 chars)",
  "about": "A 2-3 sentence about section that feels personal and authentic",
  "cta_text": "Call-to-action button text (max 30 chars, e.g. 'Order on WhatsApp')",
  "products": [
    {{"name": "...", "price": "...", "description": "Enhanced one-line description"}}
  ],
  "seo_title": "SEO-optimized page title (max 60 chars)",
  "seo_description": "SEO meta description (max 155 chars)"
}}

If no products were provided, set "products" to an empty list.
"""


def _default_content(business_name: str, category: str) -> dict[str, Any]:
    """Return sensible fallback content if AI generation fails entirely."""
    return {
        "headline": f"Welcome to {business_name}",
        "subheadline": f"Your go-to {category} — quality you can trust.",
        "about": (
            f"{business_name} is a trusted local {category} dedicated to delivering "
            f"the best experience for every customer. Come visit us today!"
        ),
        "cta_text": "Chat on WhatsApp",
        "products": [],
        "seo_title": f"{business_name} — {category.title()}",
        "seo_description": (
            f"{business_name} offers top-quality {category} services. "
            "Contact us on WhatsApp to get started!"
        ),
    }


async def generate_content(
    business_name: str,
    category: str,
    products: list[dict[str, Any]] | None = None,
    location: str | None = None,
    phone_number: str | None = None,
    business_hours: dict[str, Any] | None = None,
    is_online_only: bool = True,
    max_retries: int = 3,
) -> dict[str, Any]:
    """Call Gemini 2.0 Flash and return parsed marketing content.

    Implements exponential-backoff retry logic.  If all retries or JSON
    parsing fail, returns sensible defaults so the page still works.

    Args:
        business_name: Name of the business.
        category: Business category / vertical.
        products: Optional list of product dicts.
        location: Optional location string.
        max_retries: Number of retry attempts.

    Returns:
        Dict with keys: headline, subheadline, about, cta_text, products,
        seo_title, seo_description.
    """
    prompt = _build_prompt(
        business_name,
        category,
        products,
        location,
        phone_number,
        business_hours,
        is_online_only,
    )
    model = genai.GenerativeModel(_MODEL_NAME)

    for attempt in range(max_retries):
        try:
            response = await asyncio.to_thread(
                model.generate_content, prompt
            )
            raw_text = response.text.strip()

            # Strip markdown code fences if the model added them despite instructions
            if raw_text.startswith("```"):
                raw_text = raw_text.split("\n", 1)[-1]
            if raw_text.endswith("```"):
                raw_text = raw_text.rsplit("```", 1)[0]
            raw_text = raw_text.strip()

            data = json.loads(raw_text)

            # Validate required keys exist
            required_keys = {
                "headline", "subheadline", "about", "cta_text",
                "products", "seo_title", "seo_description",
            }
            if required_keys.issubset(data.keys()):
                return data

            logger.warning("AI response missing keys: %s", required_keys - data.keys())

        except json.JSONDecodeError as exc:
            logger.warning(
                "JSON parse error on attempt %d: %s", attempt + 1, exc
            )
        except Exception as exc:  # noqa: BLE001
            logger.warning(
                "Gemini API error on attempt %d: %s", attempt + 1, exc
            )

        # Exponential backoff: 1s, 2s, 4s
        if attempt < max_retries - 1:
            await asyncio.sleep(2**attempt)

    logger.error(
        "All %d AI generation attempts failed for '%s'. Using defaults.",
        max_retries,
        business_name,
    )
    return _default_content(business_name, category)
