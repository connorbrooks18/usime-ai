from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_login import LoginManager, login_required, current_user
import os
from werkzeug.utils import secure_filename
import sys
from summarize import Summarizer
from models import db, User
from auth_routes import register_auth_routes

app = Flask(__name__)
# Enable CORS for React frontend
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-this-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///usime.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please log in to access this page.'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Register authentication routes
register_auth_routes(app)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit to 16MB uploads

@app.route('/upload', methods=['POST'])
@login_required
def upload_file():
    # Check if any file was sent
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    
    # If the user submits an empty form
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and file.filename.lower().endswith('.pdf'):
        # Save the file
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        try:
            # Get environment variables for OpenAI
            endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
            api_key = os.environ.get("AZURE_OPENAI_API_KEY")
            
            if not endpoint or not api_key:
                return jsonify({'error': 'Azure OpenAI credentials not configured'}), 500
              
            # Initialize summarizer
            summarizer = Summarizer(endpoint=endpoint, api_key=api_key)
            
            # Generate structured JSON summary from PDF (for React frontend)
            summary_json = summarizer.summarize_from_pdf_as_json(file_path)
            
            # Return the JSON summary with user info
            return jsonify({
                'success': True,
                'filename': filename,
                'summary': summary_json,
                'user': current_user.username
            })
            
        except Exception as e:
            print(f"Error processing file: {str(e)}")
            return jsonify({'error': f'Error processing file: {str(e)}'}), 500
    else:
        return jsonify({'error': 'Only PDF files are allowed'}), 400

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    # Run the server on port 5000
    app.run(debug=True, port=5000)
