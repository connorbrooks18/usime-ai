#!/bin/bash

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

echo "Building React app..."
npm run build

# Move back to root directory
cd ..

# Initialize database
echo "Initializing database..."
cd Backend
python init_db.py

echo "Deployment preparation complete!"
echo "React build is available in my-react-app/build/"
echo "Flask server will serve this build directory."
echo "Database has been initialized."
