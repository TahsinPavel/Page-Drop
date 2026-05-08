"""add layout_config to business_pages

Revision ID: c25c995b1c4e
Revises: 63f57ccdc211
Create Date: 2026-05-07 01:29:53.553245

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'c25c995b1c4e'
down_revision: Union[str, None] = '63f57ccdc211'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'business_pages',
        sa.Column('layout_config', postgresql.JSONB(astext_type=sa.Text()), nullable=True)
    )


def downgrade() -> None:
    op.drop_column('business_pages', 'layout_config')
