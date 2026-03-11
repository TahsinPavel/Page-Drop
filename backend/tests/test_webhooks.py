"""
Tests for payment webhook endpoints.
Tests use FastAPI TestClient against the app.
"""

import json
import uuid
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app


class TestGumroadWebhook:
    """Tests for the Gumroad Ping webhook endpoint."""

    def test_rejects_invalid_secret(self):
        """Gumroad webhook rejects wrong secret when secret is configured."""
        client = TestClient(app)
        with patch(
            "app.routers.webhooks.verify_gumroad_secret",
            return_value=False,
        ):
            response = client.post(
                "/api/v1/webhooks/gumroad?secret=wrongsecret",
                data={"email": "test@test.com", "test": "false"},
            )
        assert response.status_code == 401

    def test_skips_test_payments(self):
        """Gumroad webhook skips test=true payments."""
        client = TestClient(app)
        with patch(
            "app.routers.webhooks.verify_gumroad_secret",
            return_value=True,
        ):
            response = client.post(
                "/api/v1/webhooks/gumroad?secret=",
                data={
                    "email": "test@test.com",
                    "test": "true",
                    "product_permalink": "pagedrop-pro",
                    "sale_id": "TEST123",
                },
            )
        assert response.status_code == 200
        assert response.json()["status"] == "skipped"

    def test_handles_missing_email(self):
        """Gumroad webhook returns error when email is missing."""
        client = TestClient(app)
        with patch(
            "app.routers.webhooks.verify_gumroad_secret",
            return_value=True,
        ):
            response = client.post(
                "/api/v1/webhooks/gumroad?secret=",
                data={
                    "test": "false",
                    "product_permalink": "pagedrop-pro",
                    "sale_id": "SALE123",
                },
            )
        assert response.status_code == 200
        assert response.json()["status"] == "error"
        assert response.json()["reason"] == "no email"

    def test_handles_cancellation(self):
        """Gumroad webhook handles cancelled=True."""
        client = TestClient(app)
        with patch(
            "app.routers.webhooks.verify_gumroad_secret",
            return_value=True,
        ), patch(
            "app.routers.webhooks.find_user_by_email",
            new_callable=AsyncMock,
        ) as mock_find, patch(
            "app.routers.webhooks.deactivate_plan",
            new_callable=AsyncMock,
        ):
            mock_user = MagicMock()
            mock_user.id = uuid.uuid4()
            mock_find.return_value = mock_user

            response = client.post(
                "/api/v1/webhooks/gumroad?secret=",
                data={
                    "email": "user@test.com",
                    "test": "false",
                    "cancelled": "True",
                    "sale_id": "SALE123",
                    "product_permalink": "pagedrop-pro",
                },
            )
        assert response.status_code == 200
        assert response.json()["status"] == "deactivated"


class TestNowpaymentsWebhook:
    """Tests for the NOWPayments IPN webhook endpoint."""

    def test_rejects_invalid_signature(self):
        """NOWPayments webhook rejects invalid signature."""
        client = TestClient(app)
        with patch(
            "app.routers.webhooks.verify_nowpayments_signature",
            return_value=False,
        ):
            response = client.post(
                "/api/v1/webhooks/nowpayments",
                content=b'{"payment_id": "123", "payment_status": "finished"}',
                headers={
                    "content-type": "application/json",
                    "x-nowpayments-sig": "invalidsignature",
                },
            )
        assert response.status_code == 401

    def test_acknowledges_non_finished_status(self):
        """NOWPayments webhook acknowledges but skips non-finished."""
        client = TestClient(app)
        test_user_id = str(uuid.uuid4())
        payload = json.dumps(
            {
                "payment_id": "PAY123",
                "payment_status": "waiting",
                "order_id": f"{test_user_id}_1710000000",
                "price_amount": 12.00,
                "price_currency": "usd",
                "pay_currency": "usdttrc20",
                "actually_paid": 0,
            }
        ).encode()

        with patch(
            "app.routers.webhooks.verify_nowpayments_signature",
            return_value=True,
        ):
            response = client.post(
                "/api/v1/webhooks/nowpayments",
                content=payload,
                headers={"content-type": "application/json"},
            )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "acknowledged"
        assert data["payment_status"] == "waiting"


class TestPaymentRoutes:
    """Tests for the payment API routes."""

    def test_create_invoice_requires_auth(self):
        """Create invoice endpoint requires JWT auth."""
        client = TestClient(app)
        response = client.post(
            "/api/v1/payments/nowpayments/create-invoice",
            json={"plan": "pro"},
        )
        assert response.status_code == 401

    def test_get_subscription_requires_auth(self):
        """Get subscription endpoint requires JWT auth."""
        client = TestClient(app)
        response = client.get("/api/v1/payments/subscription")
        assert response.status_code == 401

    def test_create_invoice_invalid_plan(self):
        """Create invoice rejects invalid plan names."""
        client = TestClient(app)
        with patch(
            "app.routers.payments.get_current_user",
            new_callable=AsyncMock,
        ) as mock_user:
            mock_user.return_value = MagicMock(
                id="test-uuid", email="test@test.com"
            )
            response = client.post(
                "/api/v1/payments/nowpayments/create-invoice",
                json={"plan": "invalid_plan"},
                headers={"Authorization": "Bearer fake-token"},
            )
        assert response.status_code in [400, 401, 422]
