#!/usr/bin/env python3
"""
Database initialization script for USIME AI
"""
from server import app
from models import db, User, Document

def init_db():
    """Initialize the database with tables"""
    with app.app_context():
        # Create all tables
        db.create_all()
        print("Database tables created successfully!")
        print("Tables created:")
        print("- User")
        print("- Document")

if __name__ == '__main__':
    init_db()
