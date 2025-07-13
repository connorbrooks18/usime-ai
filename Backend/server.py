from flask import Flask, request, jsonify, send_from_directory
from flask_login import LoginManager, login_required, current_user
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import sys
import json
from datetime import datetime
from summarize import Summarizer
from models import db, User, Document, ImeReport
from auth_routes import register_auth_routes
from write_ime import Writer

app = Flask(__name__, static_folder='../my-react-app/build', static_url_path='/')

# Enable CORS for all routes
CORS(app, supports_credentials=True, origins=['*'])

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

# Global error handler to ensure all errors return JSON
@app.errorhandler(Exception)
def handle_error(e):
    """Global error handler to ensure all errors return JSON"""
    import traceback
    traceback.print_exc()
    
    # Return JSON error response
    return jsonify({
        'success': False,
        'error': str(e)
    }), 500

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit to 16MB uploads

@app.route('/api/upload', methods=['POST'])
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
            
            # Save document to database
            document = Document(
                filename=filename,
                original_filename=file.filename,
                summary=json.dumps(summary_json),
                user_id=current_user.id
            )
            db.session.add(document)
            db.session.commit()
            
            # Return the JSON summary with user info and document ID
            return jsonify({
                'success': True,
                'filename': filename,
                'summary': summary_json,
                'user': current_user.username,
                'document_id': document.id
            })
            
        except Exception as e:
            # Log the full error for debugging
            print(f"Error processing file: {str(e)}")
            import traceback
            traceback.print_exc()
            
            # Clean up the uploaded file if processing failed
            if os.path.exists(file_path):
                os.remove(file_path)
            
            # Return proper JSON error response
            return jsonify({
                'success': False,
                'error': f'Error processing file: {str(e)}'
            }), 500
    else:
        return jsonify({'error': 'Only PDF files are allowed'}), 400

@app.route('/api/documents', methods=['GET'])
@login_required
def get_documents():
    """Get all documents for the current user"""
    documents = Document.query.filter_by(user_id=current_user.id).order_by(Document.upload_date.desc()).all()
    return jsonify([doc.to_dict() for doc in documents])

@app.route('/api/documents/<int:document_id>', methods=['GET'])
@login_required
def get_document(document_id):
    """Get a specific document by ID"""
    document = Document.query.filter_by(id=document_id, user_id=current_user.id).first()
    if not document:
        return jsonify({'error': 'Document not found'}), 404
    
    return jsonify(document.to_dict())

@app.route('/api/documents/<int:document_id>', methods=['DELETE'])
@login_required
def delete_document(document_id):
    """Delete a specific document"""
    document = Document.query.filter_by(id=document_id, user_id=current_user.id).first()
    if not document:
        return jsonify({'error': 'Document not found'}), 404
    
    # Delete the file from disk
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], document.filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except OSError as e:
            print(f"Error deleting file {file_path}: {e}")
    
    # Delete from database
    db.session.delete(document)
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'Document deleted successfully'})

@app.route('/api/user/stats', methods=['GET'])
@login_required
def get_user_stats():
    """Get user statistics"""
    document_count = Document.query.filter_by(user_id=current_user.id).count()
    return jsonify({
        'username': current_user.username,
        'email': current_user.email,
        'member_since': current_user.created_at.isoformat(),
        'document_count': document_count
    })

@app.route('/api/generate-ime', methods=['POST'])
@login_required
def generate_ime():
    """Generate an IME report based on medical records, interview notes, and questions"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        document_id = data.get('document_id')
        interview_notes = data.get('interview_notes')
        questions = data.get('questions')
        title = data.get('title', f'IME Report - {datetime.utcnow().strftime("%Y-%m-%d %H:%M")}')
        
        if not document_id or not interview_notes or not questions:
            return jsonify({'error': 'document_id, interview_notes, and questions are required'}), 400
        
        # Get the document from database
        document = Document.query.filter_by(id=document_id, user_id=current_user.id).first()
        if not document:
            return jsonify({'error': 'Document not found'}), 404
        
        # Get environment variables for OpenAI
        endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
        api_key = os.environ.get("AZURE_OPENAI_API_KEY")
        
        if not endpoint or not api_key:
            return jsonify({'error': 'Azure OpenAI credentials not configured'}), 500
        
        # Get the PDF file path
        pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], document.filename)
        if not os.path.exists(pdf_path):
            return jsonify({'error': 'PDF file not found'}), 404
        
        # Create temporary files for interview notes and questions
        import tempfile
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as notes_file:
            notes_file.write(interview_notes)
            notes_path = notes_file.name
            
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as questions_file:
            questions_file.write(questions)
            questions_path = questions_file.name
        
        try:
            # Initialize the IME writer
            writer = Writer(endpoint=endpoint, api_key=api_key)
            
            # Override the make_user_prompt method to use our files
            def custom_make_user_prompt(self, records_file=pdf_path, notes_file=notes_path, questions_file=questions_path):
                import text_extraction
                records = text_extraction.extract_all_text(records_file)
                with open(notes_file) as f:
                    notes = f.read()
                with open(questions_file) as f:
                    questions = f.read() 

                prompt = "{\n"
                prompt += f'"records": "{records}",\n'
                prompt += f'"interview_notes": "{notes}",\n'
                prompt += f'"questions": "{questions}"\n'
                prompt += "}"
                return prompt
            
            # Replace the method temporarily
            original_method = writer.make_user_prompt
            writer.make_user_prompt = lambda: custom_make_user_prompt(writer, pdf_path, notes_path, questions_path)
            
            # Generate the IME
            ime_result = writer.write_ime()
            
            # Parse the JSON response
            try:
                ime_data = json.loads(ime_result)
            except json.JSONDecodeError:
                # If it's not valid JSON, treat as plain text
                ime_data = {
                    'confusions': '',
                    'report': ime_result
                }
            
            # Save IME report to database
            ime_report = ImeReport(
                title=title,
                document_id=document_id,
                interview_notes=interview_notes,
                questions=questions,
                confusions=ime_data.get('confusions', ''),
                report=ime_data.get('report', ''),
                user_id=current_user.id
            )
            
            db.session.add(ime_report)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'ime': ime_data,
                'ime_id': ime_report.id
            })
                
        finally:
            # Clean up temporary files
            try:
                os.unlink(notes_path)
                os.unlink(questions_path)
            except:
                pass
                
    except Exception as e:
        print(f"Error generating IME: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': f'Error generating IME: {str(e)}'
        }), 500

@app.route('/api/ime-reports', methods=['GET'])
@login_required
def get_ime_reports():
    """Get all IME reports for the current user"""
    try:
        ime_reports = ImeReport.query.filter_by(user_id=current_user.id).order_by(ImeReport.created_at.desc()).all()
        return jsonify([report.to_dict() for report in ime_reports])
    except Exception as e:
        print(f"Error fetching IME reports: {str(e)}")
        return jsonify({'error': 'Failed to fetch IME reports'}), 500

@app.route('/api/ime-reports/<int:ime_id>', methods=['GET'])
@login_required
def get_ime_report(ime_id):
    """Get a specific IME report by ID"""
    try:
        ime_report = ImeReport.query.filter_by(id=ime_id, user_id=current_user.id).first()
        if not ime_report:
            return jsonify({'error': 'IME report not found'}), 404
        
        return jsonify(ime_report.to_dict())
    except Exception as e:
        print(f"Error fetching IME report: {str(e)}")
        return jsonify({'error': 'Failed to fetch IME report'}), 500

@app.route('/api/ime-reports/<int:ime_id>', methods=['DELETE'])
@login_required
def delete_ime_report(ime_id):
    """Delete a specific IME report"""
    try:
        ime_report = ImeReport.query.filter_by(id=ime_id, user_id=current_user.id).first()
        if not ime_report:
            return jsonify({'error': 'IME report not found'}), 404
        
        db.session.delete(ime_report)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'IME report deleted successfully'})
    except Exception as e:
        print(f"Error deleting IME report: {str(e)}")
        return jsonify({'error': 'Failed to delete IME report'}), 500

# Serve React App
@app.route('/')
def serve_react():
    return send_from_directory(app.static_folder, 'index.html')

# Handle React Router - serve index.html for any non-API routes
@app.errorhandler(404)
def not_found(error):
    # Check if it's an API request
    if request.path.startswith('/api/'):
        return jsonify({'error': 'API endpoint not found'}), 404
    # For all other requests, serve the React app
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    # Run the server - in production, this will be handled by gunicorn
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
