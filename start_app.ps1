# USIME AI - Startup Script with Authentication
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
