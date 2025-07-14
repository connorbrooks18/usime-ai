#!/bin/bash

# Install Tesseract OCR quickly
#apt-get update && apt-get install -y tesseract-ocr
apt-get update && apt-get install -y poppler-utils


# Start the Flask app with gunicorn
#gunicorn --bind 0.0.0.0:8000 app:app 
gunicorn --timeout 360 -b 0.0.0.0:8000 app:app