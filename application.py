import sys
import os

# Add the Backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'Backend'))

# Import the Flask app from server.py
from server import app

# This is what Azure expects
application = app 