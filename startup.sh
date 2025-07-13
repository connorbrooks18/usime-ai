#!/bin/bash

# Install Tesseract OCR quickly
#apt-get update && apt-get install -y tesseract-ocr

# Start the Flask app with gunicorn
gunicorn --bind 0.0.0.0:8000 app:app 