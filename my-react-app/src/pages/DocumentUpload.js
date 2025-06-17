import React, { useState } from 'react';
import './DocumentUpload.css';

function DocumentUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  
  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files) {
      // Convert FileList to array and filter for PDF files
      const fileArray = Array.from(e.target.files).filter(file => 
        file.type === 'application/pdf'
      );
      
      setSelectedFiles(prev => [...prev, ...fileArray]);
    }
  };
  
  // Remove a file from the selected files list
  const removeFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  // Simulate file upload to AI model
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadStatus('Please select at least one PDF file to upload.');
      return;
    }
    
    setUploading(true);
    setUploadStatus('Uploading files and processing with AI model...');
    
    try {
      // Simulating API call to upload files to the AI model
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Here you would typically have your actual API call to your AI model
      // For example:
      // const formData = new FormData();
      // selectedFiles.forEach(file => {
      //   formData.append('files', file);
      // });
      // const response = await fetch('your-api-endpoint', {
      //   method: 'POST',
      //   body: formData
      // });
      // const result = await response.json();
      
      setUploadStatus('Files successfully processed by the AI model!');
      setSelectedFiles([]);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="document-upload-page">
      <div className="upload-container">
        <h1>Medical Document Analysis</h1>
        <p className="upload-description">
          Upload patient medical documents (PDF format) for AI-powered analysis and report generation.
        </p>
        
        <div className="upload-area">
          <div className={`dropzone ${uploading ? 'disabled' : ''}`}>
            <input
              type="file"
              id="file-input"
              multiple
              accept=".pdf"
              onChange={handleFileChange}
              disabled={uploading}
              className="file-input"
            />
            <label htmlFor="file-input" className={uploading ? 'disabled-label' : ''}>
              <div className="upload-icon">📄</div>
              <span>Drag PDFs here or click to browse</span>
              <span className="file-format-hint">Accepts PDF files only</span>
            </label>
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="selected-files">
              <h3>Selected Documents ({selectedFiles.length})</h3>
              <ul className="file-list">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="file-item">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    <button 
                      onClick={() => removeFile(index)}
                      className="remove-file-btn"
                      disabled={uploading}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="upload-actions">
            <button 
              onClick={handleUpload} 
              className="upload-button"
              disabled={selectedFiles.length === 0 || uploading}
            >
              {uploading ? 'Processing...' : 'Analyze Documents'}
            </button>
          </div>
          
          {uploadStatus && (
            <div className={`upload-status ${uploading ? 'uploading' : uploadStatus.includes('success') ? 'success' : uploadStatus.includes('failed') ? 'error' : ''}`}>
              {uploadStatus}
            </div>
          )}
        </div>
        
        <div className="upload-info">
          <h3>How It Works</h3>
          <ol>
            <li><strong>Upload Documents</strong> - Select patient medical records in PDF format</li>
            <li><strong>AI Processing</strong> - Our AI model will analyze the documents</li>
            <li><strong>Generate Report</strong> - Receive comprehensive analysis and recommendations</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default DocumentUpload;
