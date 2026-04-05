"""FastAPI application entry point — CORS, exception handlers, and router mounts."""

import logging

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routers import ai, auth, pages, waitlist, webhooks, payments

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="PageDrop API",
    description=(
        "Backend API for PageDrop — instant AI-powered landing pages "
        "for small and WhatsApp-based businesses."
    ),
    version="1.0.0",
)

# ──────────────────────── CORS ────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://pagedrop.vercel.app",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────── Routers ────────────────────────

app.include_router(auth.router, prefix="/api/v1")
app.include_router(pages.router, prefix="/api/v1")
app.include_router(ai.router, prefix="/api/v1")
app.include_router(waitlist.router, prefix="/api/v1/waitlist")
app.include_router(webhooks.router, prefix="/api/v1/webhooks", tags=["Webhooks"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["Payments"])

# ──────────────────────── Exception handlers ────────────────────────


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all handler for unhandled exceptions — returns a 500 response."""
    logger.error("Unhandled exception on %s %s: %s", request.method, request.url, exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occurred.", "status_code": 500},
    )


# ──────────────────────── Health check ────────────────────────


@app.get("/health", tags=["Health"])
async def health_check() -> dict:
    """Simple health-check endpoint."""
    return {"status": "healthy", "service": "PageDrop API"}
