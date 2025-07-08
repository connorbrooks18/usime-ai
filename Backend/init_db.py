#!/usr/bin/env python3
"""
Database initialization script for USIME AI
"""
from server import app
from models import db

def init_db():
    """Initialize the database with tables"""
    with app.app_context():
        # Create all tables
        db.create_all()
        print("Database tables created successfully!")

if __name__ == '__main__':
    init_db()
