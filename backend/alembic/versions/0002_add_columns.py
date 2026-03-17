"""add admin and integration columns

Revision ID: 0002_add_columns
Revises: 0001_initial
Create Date: 2026-03-10 11:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0002_add_columns'
down_revision = '0001_initial'
branch_labels = None
depends_on = None


def upgrade():
    # Use IF NOT EXISTS so this migration is safe even if 0001_initial already
    # created the tables with these columns (fresh database scenario).
    conn = op.get_bind()
    conn.execute(sa.text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false"))
    conn.execute(sa.text("ALTER TABLE workflows ADD COLUMN IF NOT EXISTS webhook_url VARCHAR"))
    conn.execute(sa.text("ALTER TABLE workflows ADD COLUMN IF NOT EXISTS email VARCHAR"))
    conn.execute(sa.text("ALTER TABLE workflows ADD COLUMN IF NOT EXISTS slack_channel VARCHAR"))
    conn.execute(sa.text("ALTER TABLE executions ADD COLUMN IF NOT EXISTS details JSON"))


def downgrade():
    op.drop_column('executions', 'details')
    op.drop_column('workflows', 'slack_channel')
    op.drop_column('workflows', 'email')
    op.drop_column('workflows', 'webhook_url')
    op.drop_column('users', 'is_admin')