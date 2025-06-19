# Simple USIME_AI Launcher
# Starts both frontend and backend in separate windows

# Get the folder where this script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

# Start Flask backend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\Backend'; python server.py"

# Start React frontend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\my-react-app'; npm start"

Write-Host "Started both servers in separate windows:"
Write-Host "Backend: http://localhost:5000"
Write-Host "Frontend: http://localhost:3000"
