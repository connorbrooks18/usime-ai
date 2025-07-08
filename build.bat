@echo off
REM Build script for USIME AI Application (Windows)
REM This script builds the React frontend and prepares the Flask backend for deployment

echo Starting build process...

REM Navigate to React app directory
cd my-react-app

REM Install dependencies
echo Installing React dependencies...
npm install

REM Build React app
echo Building React app...
npm run build

REM Move back to root directory
cd ..

echo Build completed successfully!
echo React build is now available in my-react-app/build/
echo Flask server is configured to serve this build directory.
