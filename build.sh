#!/bin/bash

# Build script for USIME AI Application
# This script builds the React frontend and prepares the Flask backend for deployment

echo "Starting build process..."

# Navigate to React app directory
cd my-react-app

# Install dependencies
echo "Installing React dependencies..."
npm install

# Build React app
echo "Building React app..."
npm run build

# Move back to root directory
cd ..

echo "Build completed successfully!"
echo "React build is now available in my-react-app/build/"
echo "Flask server is configured to serve this build directory."
