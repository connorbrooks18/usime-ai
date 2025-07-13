from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    documents = db.relationship('Document', backref='user', lazy=True, cascade='all, delete-orphan')
    ime_reports = db.relationship('ImeReport', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    summary = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            'upload_date': self.upload_date.isoformat(),
            'summary': json.loads(self.summary) if self.summary else None,
            'user_id': self.user_id
        }
    
    def __repr__(self):
        return f'<Document {self.original_filename}>'

class ImeReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
    interview_notes = db.Column(db.Text, nullable=False)
    questions = db.Column(db.Text, nullable=False)
    confusions = db.Column(db.Text, nullable=True)
    report = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Relationship to the source document
    document = db.relationship('Document', backref='ime_reports')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'document_id': self.document_id,
            'document_name': self.document.original_filename if self.document else None,
            'interview_notes': self.interview_notes,
            'questions': self.questions,
            'confusions': self.confusions,
            'report': self.report,
            'created_at': self.created_at.isoformat(),
            'user_id': self.user_id
        }
    
    def __repr__(self):
        return f'<ImeReport {self.title}>'
