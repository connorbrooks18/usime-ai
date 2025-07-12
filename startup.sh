#!/bin/bash
cd /home/site/wwwroot
echo "Installing dependencies..."
pip install -r requirements.txt
echo "Dependencies installed successfully"
cd Backend
echo "Starting Flask app..."
python server.py 