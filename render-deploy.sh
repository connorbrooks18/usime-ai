#!/bin/bash
set -e  # Exit on any error

# Render.com deployment script for USIME AI
# This script is run by Render during deployment

echo "Starting Render deployment..."

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Install Node.js dependencies and build React app
echo "Installing Node.js dependencies..."
cd my-react-app
npm install

# Fix permissions for react-scripts
echo "Fixing Node.js permissions..."
chmod +x node_modules/.bin/react-scripts

echo "Building React app..."
npm run build

# Check if build was successful
if [ -d "build" ]; then
    echo "React build successful. Contents:"
    ls -la build/
    ls -la build/static/
else
    echo "ERROR: React build directory not found!"
    exit 1
fi

# Move back to root directory
cd ..

# Initialize database (only if DATABASE_URL is set)
if [ -n "$DATABASE_URL" ]; then
    echo "Initializing database..."
    cd Backend
    python -c "
from server import app, db
with app.app_context():
    # Drop existing tables and recreate (for now, since this is early development)
    db.drop_all()
    db.create_all()
    print('Database tables recreated with updated schema')
"
    cd ..
else
    echo "DATABASE_URL not set, skipping database initialization"
fi

echo "Deployment preparation complete!"
echo "React build is available in my-react-app/build/"
echo "Flask server will serve this build directory."