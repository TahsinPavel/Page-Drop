"""
Verification tests for subscriptions and payment_events tables.
Tests connect to the real NeonDB and verify table structure.
Run with: pytest tests/test_payment_tables.py -v
"""
import pytest
import pytest_asyncio
import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from app.config import settings


# ─── Fixtures ───────────────────────────────────────────────


@pytest.fixture(scope="module")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="module")
async def engine():
    """Create async engine connected to real NeonDB."""
    eng = create_async_engine(settings.DATABASE_URL, echo=False)
    yield eng
    await eng.dispose()


@pytest_asyncio.fixture(scope="module")
async def db_tables(engine):
    """Fetch all table names from actual database."""
    async with engine.connect() as conn:
        result = await conn.execute(text(
            "SELECT table_name FROM information_schema.tables "
            "WHERE table_schema = 'public'"
        ))
        return [row[0] for row in result.fetchall()]


@pytest_asyncio.fixture(scope="module")
async def db_columns(engine):
    """Fetch all columns for all tables from actual database."""
    async with engine.connect() as conn:
        result = await conn.execute(text(
            "SELECT table_name, column_name, data_type, is_nullable, column_default "
            "FROM information_schema.columns "
            "WHERE table_schema = 'public' "
            "ORDER BY table_name, ordinal_position"
        ))
        rows = result.fetchall()

    columns: dict[str, dict[str, dict[str, object]]] = {}
    for table, col, dtype, nullable, default in rows:
        if table not in columns:
            columns[table] = {}
        columns[table][col] = {
            "type": dtype,
            "nullable": nullable == "YES",
            "default": default,
        }
    return columns


@pytest_asyncio.fixture(scope="module")
async def db_indexes(engine):
    """Fetch all indexes from actual database."""
    async with engine.connect() as conn:
        result = await conn.execute(text("""
            SELECT
                t.relname AS table_name,
                i.relname AS index_name,
                a.attname AS column_name
            FROM
                pg_class t
                JOIN pg_index ix ON t.oid = ix.indrelid
                JOIN pg_class i ON i.oid = ix.indexrelid
                JOIN pg_attribute a ON a.attrelid = t.oid
                    AND a.attnum = ANY(ix.indkey)
            WHERE
                t.relkind = 'r'
                AND t.relname IN ('subscriptions', 'payment_events')
            ORDER BY t.relname, i.relname
        """))
        return [(row[0], row[1], row[2]) for row in result.fetchall()]


async def _fresh_connection():
    """Create a fresh disposable engine + connection for one-shot queries."""
    eng = create_async_engine(settings.DATABASE_URL, echo=False)
    return eng


# ─── Table Existence Tests ───────────────────────────────────


@pytest.mark.asyncio
async def test_subscriptions_table_exists(db_tables):
    """subscriptions table must exist in database."""
    assert "subscriptions" in db_tables, (
        "Table 'subscriptions' not found in database. "
        "Did you run 'alembic upgrade head'?"
    )


@pytest.mark.asyncio
async def test_payment_events_table_exists(db_tables):
    """payment_events table must exist in database."""
    assert "payment_events" in db_tables, (
        "Table 'payment_events' not found in database. "
        "Did you run 'alembic upgrade head'?"
    )


# ─── Subscriptions Column Tests ──────────────────────────────


@pytest.mark.asyncio
async def test_subscriptions_has_all_columns(db_columns):
    """subscriptions table must have every required column."""
    required_columns = [
        "id", "user_id", "plan", "status", "payment_provider",
        "provider_sub_id", "current_period_start", "current_period_end",
        "cancelled_at", "created_at", "updated_at",
    ]
    table_cols = db_columns.get("subscriptions", {})
    missing = [c for c in required_columns if c not in table_cols]
    assert not missing, f"subscriptions table is missing columns: {missing}"


@pytest.mark.asyncio
async def test_subscriptions_id_is_uuid(db_columns):
    col = db_columns["subscriptions"]["id"]
    assert col["type"] in ("uuid", "UUID"), (
        f"subscriptions.id should be UUID, got: {col['type']}"
    )


@pytest.mark.asyncio
async def test_subscriptions_user_id_is_uuid(db_columns):
    col = db_columns["subscriptions"]["user_id"]
    assert col["type"] in ("uuid", "UUID"), (
        f"subscriptions.user_id should be UUID, got: {col['type']}"
    )


@pytest.mark.asyncio
async def test_subscriptions_plan_has_default(db_columns):
    col = db_columns["subscriptions"]["plan"]
    assert col["default"] is not None, (
        "subscriptions.plan should have a default value of 'free'"
    )
    assert "free" in str(col["default"]), (
        f"subscriptions.plan default should be 'free', got: {col['default']}"
    )


@pytest.mark.asyncio
async def test_subscriptions_status_has_default(db_columns):
    col = db_columns["subscriptions"]["status"]
    assert col["default"] is not None, (
        "subscriptions.status should have a default value of 'active'"
    )
    assert "active" in str(col["default"]), (
        f"subscriptions.status default should be 'active', got: {col['default']}"
    )


@pytest.mark.asyncio
async def test_subscriptions_nullable_columns(db_columns):
    """These columns must be nullable."""
    for col_name in [
        "payment_provider", "provider_sub_id",
        "current_period_start", "current_period_end", "cancelled_at",
    ]:
        col = db_columns["subscriptions"][col_name]
        assert col["nullable"] is True, (
            f"subscriptions.{col_name} should be nullable but is NOT NULL"
        )


@pytest.mark.asyncio
async def test_subscriptions_not_nullable_columns(db_columns):
    """These columns must NOT be nullable."""
    for col_name in ["id", "user_id", "plan", "status", "created_at", "updated_at"]:
        col = db_columns["subscriptions"][col_name]
        assert col["nullable"] is False, (
            f"subscriptions.{col_name} should be NOT NULL but is nullable"
        )


# ─── Payment Events Column Tests ─────────────────────────────


@pytest.mark.asyncio
async def test_payment_events_has_all_columns(db_columns):
    """payment_events table must have every required column."""
    required_columns = [
        "id", "user_id", "payment_provider", "event_type",
        "provider_sale_id", "amount", "currency", "plan",
        "raw_payload", "is_test", "processed", "error_message", "created_at",
    ]
    table_cols = db_columns.get("payment_events", {})
    missing = [c for c in required_columns if c not in table_cols]
    assert not missing, f"payment_events table is missing columns: {missing}"


@pytest.mark.asyncio
async def test_payment_events_id_is_uuid(db_columns):
    col = db_columns["payment_events"]["id"]
    assert col["type"] in ("uuid", "UUID"), (
        f"payment_events.id should be UUID, got: {col['type']}"
    )


@pytest.mark.asyncio
async def test_payment_events_user_id_nullable(db_columns):
    """user_id is nullable because user might not exist at webhook time."""
    col = db_columns["payment_events"]["user_id"]
    assert col["nullable"] is True, "payment_events.user_id should be nullable"


@pytest.mark.asyncio
async def test_payment_events_raw_payload_is_jsonb(db_columns):
    col = db_columns["payment_events"]["raw_payload"]
    assert "json" in col["type"].lower(), (
        f"payment_events.raw_payload should be JSONB, got: {col['type']}"
    )


@pytest.mark.asyncio
async def test_payment_events_amount_is_integer(db_columns):
    col = db_columns["payment_events"]["amount"]
    assert col["type"] in ("integer", "int4", "int"), (
        f"payment_events.amount should be INTEGER, got: {col['type']}"
    )


@pytest.mark.asyncio
async def test_payment_events_booleans_have_defaults(db_columns):
    """is_test and processed must have default=false."""
    for col_name in ["is_test", "processed"]:
        col = db_columns["payment_events"][col_name]
        assert col["default"] is not None, (
            f"payment_events.{col_name} should have default=false"
        )
        assert "false" in str(col["default"]).lower(), (
            f"payment_events.{col_name} default should be false, "
            f"got: {col['default']}"
        )


@pytest.mark.asyncio
async def test_payment_events_not_nullable_columns(db_columns):
    """These columns must NOT be nullable."""
    for col_name in [
        "id", "payment_provider", "event_type",
        "is_test", "processed", "created_at",
    ]:
        col = db_columns["payment_events"][col_name]
        assert col["nullable"] is False, (
            f"payment_events.{col_name} should be NOT NULL but is nullable"
        )


@pytest.mark.asyncio
async def test_payment_events_nullable_columns(db_columns):
    """These columns must be nullable."""
    for col_name in [
        "user_id", "provider_sale_id", "amount",
        "currency", "plan", "raw_payload", "error_message",
    ]:
        col = db_columns["payment_events"][col_name]
        assert col["nullable"] is True, (
            f"payment_events.{col_name} should be nullable but is NOT NULL"
        )


# ─── Index Tests ─────────────────────────────────────────────


@pytest.mark.asyncio
async def test_subscriptions_user_id_index_exists(db_indexes):
    """subscriptions.user_id must have an index."""
    sub_indexes = [
        (t, i, c) for t, i, c in db_indexes
        if t == "subscriptions" and c == "user_id"
    ]
    assert len(sub_indexes) > 0, "No index found on subscriptions.user_id"


@pytest.mark.asyncio
async def test_payment_events_indexes_exist(db_indexes):
    """payment_events must have indexes on key columns."""
    required_indexed_cols = [
        "user_id", "payment_provider", "event_type",
        "provider_sale_id", "created_at",
    ]
    pe_indexed_cols = [c for t, i, c in db_indexes if t == "payment_events"]
    missing = [c for c in required_indexed_cols if c not in pe_indexed_cols]
    assert not missing, f"payment_events is missing indexes on: {missing}"


# ─── Foreign Key Tests (fresh engine to avoid stale connections) ──


@pytest.mark.asyncio
async def test_foreign_keys_exist():
    """Both tables must have correct FK to users.id."""
    eng = await _fresh_connection()
    try:
        async with eng.connect() as conn:
            result = await conn.execute(text("""
                SELECT
                    tc.table_name,
                    kcu.column_name,
                    ccu.table_name AS foreign_table,
                    ccu.column_name AS foreign_column
                FROM information_schema.table_constraints AS tc
                JOIN information_schema.key_column_usage AS kcu
                    ON tc.constraint_name = kcu.constraint_name
                JOIN information_schema.constraint_column_usage AS ccu
                    ON ccu.constraint_name = tc.constraint_name
                WHERE tc.constraint_type = 'FOREIGN KEY'
                    AND tc.table_name IN ('subscriptions', 'payment_events')
            """))
            fks = [(r[0], r[1], r[2], r[3]) for r in result.fetchall()]

        sub_fk = any(
            t == "subscriptions" and c == "user_id" and ft == "users" and fc == "id"
            for t, c, ft, fc in fks
        )
        assert sub_fk, "Missing FK: subscriptions.user_id → users.id"

        pe_fk = any(
            t == "payment_events" and c == "user_id" and ft == "users" and fc == "id"
            for t, c, ft, fc in fks
        )
        assert pe_fk, "Missing FK: payment_events.user_id → users.id"
    finally:
        await eng.dispose()


# ─── Unique Constraint Tests (fresh engine) ───────────────────


@pytest.mark.asyncio
async def test_subscriptions_user_id_unique():
    """subscriptions.user_id must be unique (one row per user)."""
    eng = await _fresh_connection()
    try:
        async with eng.connect() as conn:
            # Check formal UNIQUE constraints first
            result = await conn.execute(text("""
                SELECT 
                    tc.table_name,
                    kcu.column_name,
                    tc.constraint_type
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu
                    ON tc.constraint_name = kcu.constraint_name
                WHERE tc.table_name = 'subscriptions'
                    AND tc.constraint_type IN ('UNIQUE', 'PRIMARY KEY')
            """))
            constraints = [(r[0], r[1], r[2]) for r in result.fetchall()]

        has_unique_constraint = any(
            col == "user_id" and ctype == "UNIQUE" for _, col, ctype in constraints
        )

        if not has_unique_constraint:
            # Also check for unique indexes (Alembic creates these)
            async with eng.connect() as conn:
                result = await conn.execute(text("""
                    SELECT indexname
                    FROM pg_indexes
                    WHERE tablename = 'subscriptions'
                    AND indexdef ILIKE '%unique%'
                    AND indexdef ILIKE '%user_id%'
                """))
                unique_indexes = result.fetchall()
            has_unique_constraint = len(unique_indexes) > 0

        assert has_unique_constraint, (
            "subscriptions.user_id must have a UNIQUE constraint or unique index "
            "(one subscription per user)"
        )
    finally:
        await eng.dispose()


# ─── Quick Insert/Delete Smoke Tests (fresh engine) ──────────


@pytest.mark.asyncio
async def test_can_insert_and_delete_payment_event():
    """
    Verify we can actually write to payment_events table.
    Inserts a test row then immediately deletes it.
    """
    eng = await _fresh_connection()
    try:
        async with eng.begin() as conn:
            await conn.execute(text("""
                INSERT INTO payment_events (
                    id, payment_provider, event_type,
                    is_test, processed, created_at
                ) VALUES (
                    gen_random_uuid(), 'gumroad', 'sale',
                    true, false, now()
                )
            """))

            result = await conn.execute(text("""
                SELECT COUNT(*) FROM payment_events
                WHERE is_test = true AND payment_provider = 'gumroad'
            """))
            count = result.scalar()
            assert count is not None and count >= 1, (
                "Test row was not inserted correctly"
            )

            await conn.execute(text("""
                DELETE FROM payment_events
                WHERE is_test = true AND payment_provider = 'gumroad'
            """))
    finally:
        await eng.dispose()


@pytest.mark.asyncio
async def test_can_insert_and_delete_subscription():
    """
    Verify we can actually write to subscriptions table.
    Requires a real user_id — skips if no users exist.
    """
    eng = await _fresh_connection()
    try:
        async with eng.begin() as conn:
            result = await conn.execute(text("SELECT id FROM users LIMIT 1"))
            row = result.fetchone()

            if not row:
                pytest.skip("No users in database — skipping insert test")

            user_id = row[0]

            existing = await conn.execute(text(
                "SELECT id FROM subscriptions WHERE user_id = :uid"
            ), {"uid": user_id})

            if existing.fetchone():
                pytest.skip(
                    "User already has a subscription row — skipping insert test"
                )

            await conn.execute(text("""
                INSERT INTO subscriptions (
                    id, user_id, plan, status, created_at, updated_at
                ) VALUES (
                    gen_random_uuid(), :uid, 'free', 'active', now(), now()
                )
            """), {"uid": user_id})

            result = await conn.execute(text(
                "SELECT plan, status FROM subscriptions WHERE user_id = :uid"
            ), {"uid": user_id})
            row = result.fetchone()
            assert row is not None
            assert row[0] == "free"
            assert row[1] == "active"

            await conn.execute(text(
                "DELETE FROM subscriptions WHERE user_id = :uid"
            ), {"uid": user_id})
    finally:
        await eng.dispose()
