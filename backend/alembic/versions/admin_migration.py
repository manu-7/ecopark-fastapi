"""add is_admin to users

Revision ID: a1b2c3d4e5f6
Revises: 7a9f8e673d2d
Create Date: 2026-06-06
"""
from alembic import op
import sqlalchemy as sa

revision = 'a1b2c3d4e5f6'
down_revision = '7a9f8e673d2d'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('users', sa.Column('is_admin', sa.Boolean(), nullable=False, server_default='false'))


def downgrade():
    op.drop_column('users', 'is_admin')
