import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';
import './CreateIme.css';

function CreateIme() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [imeTitle, setImeTitle] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [questions, setQuestions] = useState('');
  const [generating, setGenerating] = useState(false);
  const [imeResult, setImeResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      } else {
        setError('Failed to fetch documents');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Network error while fetching documents');
    }
  };

  const handleGenerateIme = async () => {
    if (!selectedDocument) {
      setError('Please select a medical document');
      return;
    }
    
    if (!imeTitle.trim()) {
      setError('Please provide a title for the IME report');
      return;
    }
    
    if (!interviewNotes.trim()) {
      setError('Please provide interview notes');
      return;
    }
    
    if (!questions.trim()) {
      setError('Please provide legal questions');
      return;
    }

    setGenerating(true);
    setError('');
    setImeResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-ime`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          document_id: selectedDocument,
          title: imeTitle,
          interview_notes: interviewNotes,
          questions: questions
        })
      });

      const result = await response.json();

      if (response.ok) {
        setImeResult(result.ime);
        setError(''); // Clear any previous errors
      } else {
        throw new Error(result.error || 'Failed to generate IME');
      }
    } catch (error) {
      console.error('IME generation error:', error);
      setError(`IME generation failed: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleDocumentChange = (documentId) => {
    setSelectedDocument(documentId);
    setError('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="create-ime-page">
      <div className="ime-container">
        <h1>Generate IME Report</h1>
        <p className="ime-description">
          Create an Independent Medical Evaluation (IME) report for legal cases. 
          This tool analyzes medical records, interview notes, and legal questions to generate a comprehensive medical evaluation.
        </p>

        <div className="ime-form">
          {/* Step 1: IME Title */}
          <div className="form-section">
            <h3>Step 1: IME Report Title</h3>
            <p className="section-description">
              Provide a descriptive title for this IME report.
            </p>
                <input 
                  type="text" 
              value={imeTitle}
              onChange={(e) => setImeTitle(e.target.value)}
              placeholder="e.g., IME Report - John Doe - Motor Vehicle Accident"
              className="title-input"
            />
          </div>
          
          {/* Step 2: Select Medical Document */}
          <div className="form-section">
            <h3>Step 2: Select Medical Records</h3>
            <div className="document-selector">
              {documents.length === 0 ? (
                <div className="no-documents">
                  <p>No documents available. Please upload medical records first.</p>
                  <Link to="/upload" className="upload-link">Upload Documents</Link>
                </div>
              ) : (
                <div className="document-list">
                  {documents.map(doc => (
                    <div 
                      key={doc.id} 
                      className={`document-option ${selectedDocument === doc.id ? 'selected' : ''}`}
                      onClick={() => handleDocumentChange(doc.id)}
                    >
                      <div className="document-info">
                        <h4>{doc.original_filename}</h4>
                        <p>Uploaded: {formatDate(doc.upload_date)}</p>
              </div>
                      <div className="selection-indicator">
                        {selectedDocument === doc.id ? '✓' : ''}
              </div>
            </div>
                  ))}
              </div>
              )}
            </div>
          </div>
          
          {/* Step 3: Interview Notes */}
          <div className="form-section">
            <h3>Step 3: Interview Notes</h3>
            <p className="section-description">
              Enter the doctor's examination findings, patient interview notes, and physical examination results.
            </p>
            <textarea
              value={interviewNotes}
              onChange={(e) => setInterviewNotes(e.target.value)}
              placeholder="Enter the doctor's interview notes, physical examination findings, and assessment..."
              className="notes-textarea"
              rows={8}
                />
              </div>
              
          {/* Step 4: Legal Questions */}
          <div className="form-section">
            <h3>Step 4: Legal Questions</h3>
            <p className="section-description">
              Enter specific questions from the attorney or court that need to be addressed in the IME.
            </p>
            <textarea
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="Enter legal questions to be addressed in the IME report..."
              className="questions-textarea"
              rows={6}
            />
          </div>
          
          {/* Generate Button */}
          <div className="form-section">
            <button 
              onClick={handleGenerateIme}
              className="generate-ime-btn"
              disabled={!selectedDocument || !imeTitle.trim() || !interviewNotes.trim() || !questions.trim() || generating}
            >
              {generating ? 'Generating IME...' : 'Generate IME Report'}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* IME Result */}
          {imeResult && (
            <div className="ime-result">
              <h3>Generated IME Report</h3>
              
              {/* Confusions Section */}
              {imeResult.confusions && (
                <div className="ime-section">
                  <h4>Confusions and Contradictions</h4>
                  <div className="confusions-content">
                    {imeResult.confusions.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Report Section */}
              {imeResult.report && (
                <div className="ime-section">
                  <h4>IME Report</h4>
                  <div className="report-content">
                    {imeResult.report.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Message */}
              <div className="success-message">
                <p>✅ IME report generated successfully and saved to your history!</p>
                <Link to="/ime-history" className="view-history-link">View All IME Reports</Link>
            </div>
            
              {/* Download/Print Options */}
              <div className="ime-actions">
                <button 
                  onClick={() => window.print()}
                  className="print-btn"
                >
                  Print Report
                </button>
                      <button 
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(imeResult, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'ime-report.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="download-btn"
                >
                  Download JSON
                      </button>
              </div>
            </div>
          )}
          </div>
          
        {/* Information Section */}
        <div className="ime-info">
          <h3>About IME Reports</h3>
          <div className="info-content">
            <p>
              <strong>Independent Medical Evaluations (IMEs)</strong> are comprehensive medical assessments 
              used in legal cases, particularly personal injury lawsuits. They provide:
            </p>
            <ul>
              <li><strong>Medical Analysis:</strong> Review of all medical records and diagnostic studies</li>
              <li><strong>Causation Assessment:</strong> Determination of whether the injury was caused by the incident</li>
              <li><strong>Impairment Rating:</strong> Evaluation of permanent impairment using AMA guidelines</li>
              <li><strong>Credibility Assessment:</strong> Evaluation of patient's symptom reporting</li>
              <li><strong>Legal Recommendations:</strong> Expert medical opinion for legal proceedings</li>
              </ul>
            <p>
              This tool uses AI to generate professional IME reports based on the provided medical records, 
              interview notes, and specific legal questions.
            </p>
          </div>
          </div>
      </div>
    </div>
  );
}

export default CreateIme;
