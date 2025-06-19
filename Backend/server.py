from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import sys
from summarize import Summarizer

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit to 16MB uploads

@app.route('/upload', methods=['POST'])
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
            
            # Generate structured JSON summary from PDF
            summary_json = summarizer.summarize_from_pdf_as_json(file_path)
            
            # Return the JSON summary
            return jsonify({
                'success': True,
                'filename': filename,
                'summary': summary_json
            })
            
        except Exception as e:
            print(f"Error processing file: {str(e)}")
            return jsonify({'error': f'Error processing file: {str(e)}'}), 500
    else:
        return jsonify({'error': 'Only PDF files are allowed'}), 400

if __name__ == '__main__':
    # Run the server on port 5000
    app.run(debug=True, port=5000)
