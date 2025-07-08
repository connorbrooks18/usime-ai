# USIME AI - Production Startup Script
# Builds React app and starts Flask server serving the built app

# Get the folder where this script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "Starting USIME AI Application (Production Mode)..." -ForegroundColor Green

# Build React app first
Write-Host "Building React frontend..." -ForegroundColor Yellow
Set-Location "$scriptDir\my-react-app"
npm install
npm run build

# Start Flask server (serves React build)
Write-Host "Starting Flask server (serving React build)..." -ForegroundColor Yellow
Set-Location "$scriptDir\Backend"
python server.py

Write-Host "Application is now running at http://localhost:5000" -ForegroundColor Green Script with Authentication
# Starts both frontend and backend in separate windows

# Get the folder where this script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "Starting USIME AI Application with Authentication..." -ForegroundColor Green

# Start Flask backend server
Write-Host "Starting Flask backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\Backend'; C:/Users/gamer/OneDrive/Desktop/Code_Projects/USIME_AI/usime-ai/.venv/Scripts/python.exe server.py"

# Wait a moment for Flask to start
Start-Sleep -Seconds 3

# Start React frontend server
Write-Host "Starting React frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\my-react-app'; npm start"

Write-Host "Both servers are starting up!" -ForegroundColor Green
Write-Host "Flask Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "React Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Access the app at http://localhost:3000" -ForegroundColor Green
