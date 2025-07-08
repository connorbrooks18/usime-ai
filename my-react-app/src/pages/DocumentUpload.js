import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './DocumentUpload.css';

function DocumentUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [summary, setSummary] = useState('');
  
  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files) {
      // Convert FileList to array and filter for PDF files
      const fileArray = Array.from(e.target.files).filter(file => 
        file.type === 'application/pdf'
      );
      
      setSelectedFiles(prev => [...prev, ...fileArray]);
      // Clear any previous summary when new files are selected
      setSummary('');
    }
  };
  
  // Remove a file from the selected files list
  const removeFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    // Clear any previous summary when files are removed
    setSummary('');
  };
  
  // Upload file to backend for summarization
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadStatus('Please select at least one PDF file to upload.');
      return;
    }
    
    setUploading(true);
    setUploadStatus('Uploading file and generating summary...');
    setSummary('');
    
    try {
      // Create form data to send the file
      const formData = new FormData();
      // For simplicity, we'll just process the first selected file
      formData.append('file', selectedFiles[0]);
      
      // Send the file to our Flask backend
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setUploadStatus(`Successfully processed ${result.filename}! Document saved to your history.`);
        console.log('Summary received:', result.summary);
        console.log('Summary type:', typeof result.summary);
        console.log('Document ID:', result.document_id);
        setSummary(result.summary);
      } else {
        throw new Error(result.error || 'Failed to process file');
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`Upload failed: ${error.message}`);
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
              {uploadStatus.includes('success') && (
                <div className="success-actions">
                  <Link to="/history" className="view-history-link">View Document History</Link>
                </div>
              )}
            </div>
          )}          {summary && (
            <div className="summary-container">
              <h3>Medical Document Summary</h3>
              
              {/* Patient Information Section */}
              {summary.patientInfo && (
                <div className="summary-section">
                  <h4>Patient Information</h4>
                  <div className="info-grid">
                    {summary.patientInfo.name && (
                      <div className="info-item">
                        <span className="info-label">Name:</span>
                        <span className="info-value">{summary.patientInfo.name}</span>
                      </div>
                    )}
                    {summary.patientInfo.dob && (
                      <div className="info-item">
                        <span className="info-label">DOB:</span>
                        <span className="info-value">{summary.patientInfo.dob}</span>
                      </div>
                    )}
                    {summary.patientInfo.address && (
                      <div className="info-item">
                        <span className="info-label">Address:</span>
                        <span className="info-value">{summary.patientInfo.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Injury Details Section */}
              {summary.injury && (
                <div className="summary-section">
                  <h4>Injury Details</h4>
                  <div className="info-grid">
                    {summary.injury.mechanism && (
                      <div className="info-item">
                        <span className="info-label">Mechanism:</span>
                        <span className="info-value">{summary.injury.mechanism}</span>
                      </div>
                    )}
                    {summary.injury.date && (
                      <div className="info-item">
                        <span className="info-label">Date:</span>
                        <span className="info-value">{summary.injury.date}</span>
                      </div>
                    )}
                    {summary.injury.details && (
                      <div className="info-item full-width">
                        <span className="info-label">Details:</span>
                        <span className="info-value">{summary.injury.details}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Medical History Section */}
              {summary.medicalHistory && summary.medicalHistory.length > 0 && (
                <div className="summary-section">
                  <h4>Medical History</h4>
                  <ul className="info-list">
                    {summary.medicalHistory.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Care History Section */}
              {summary.careHistory && summary.careHistory.length > 0 && (
                <div className="summary-section">
                  <h4>Care History</h4>
                  <div className="timeline">
                    {summary.careHistory.map((visit, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-date">{visit.date}</div>
                        <div className="timeline-content">
                          <div className="timeline-title">{visit.provider}</div>
                          <div className="timeline-detail"><strong>Findings:</strong> {visit.findings}</div>
                          {visit.recommendations && (
                            <div className="timeline-detail"><strong>Recommendations:</strong> {visit.recommendations}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Imaging Section */}
              {summary.imaging && summary.imaging.length > 0 && (
                <div className="summary-section">
                  <h4>Imaging Studies</h4>
                  <table className="imaging-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Facility</th>
                        <th>Findings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.imaging.map((image, index) => (
                        <tr key={index}>
                          <td>{image.date}</td>
                          <td>{image.type}</td>
                          <td>{image.facility}</td>
                          <td>{image.findings}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Functional Limitations Section */}
              {summary.functionalLimitations && summary.functionalLimitations.length > 0 && (
                <div className="summary-section">
                  <h4>Functional Limitations</h4>
                  <ul className="info-list">
                    {summary.functionalLimitations.map((limitation, index) => (
                      <li key={index}>{limitation}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Treatments Section */}
              {summary.treatments && summary.treatments.length > 0 && (
                <div className="summary-section">
                  <h4>Treatments</h4>
                  <div className="treatments-list">
                    {summary.treatments.map((treatment, index) => (
                      <div key={index} className="treatment-item">
                        <h5>{treatment.type}</h5>
                        <p>{treatment.details}</p>
                        {treatment.providers && treatment.providers.length > 0 && (
                          <div>
                            <strong>Providers:</strong> {treatment.providers.join(", ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Prognosis Section */}
              {summary.prognosis && (
                <div className="summary-section">
                  <h4>Prognosis</h4>
                  <p className="prognosis">{summary.prognosis}</p>
                </div>
              )}
              
              {/* Recommendations Section */}
              {summary.recommendations && summary.recommendations.length > 0 && (
                <div className="summary-section">
                  <h4>Recommendations</h4>
                  <ul className="info-list">
                    {summary.recommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Issues and Ambiguities Section */}
              {summary.issues && summary.issues.length > 0 && (
                <div className="summary-section issues-section">
                  <h4>Issues and Ambiguities</h4>
                  <ul className="info-list issues-list">
                    {summary.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
                {/* Fallback summary case */}
              {summary.note && summary.note.includes("fallback") && summary.summary && (
                <div className="summary-section fallback-summary">
                  <h4>Document Summary (Simple Format)</h4>
                  <p className="fallback-note">{summary.note}</p>
                  <div className="fallback-content">
                    {summary.summary.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Error handling */}
              {summary.error && (
                <div className="summary-error">
                  <h4>Error Processing Document</h4>
                  <p>{summary.error}</p>
                  <p>{summary.details}</p>
                </div>
              )}
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
