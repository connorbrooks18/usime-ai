import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import './DocumentHistory.css';

const DocumentHistory = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentClick = async (documentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setSelectedDocument(data);
      } else {
        setError('Failed to fetch document details');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      setError('Network error while fetching document');
    }
  };

  const handleDeleteDocument = async (documentId, event) => {
    event.stopPropagation(); // Prevent document selection when clicking delete
    
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (response.ok) {
          setDocuments(documents.filter(doc => doc.id !== documentId));
          if (selectedDocument && selectedDocument.id === documentId) {
            setSelectedDocument(null);
          }
        } else {
          setError('Failed to delete document');
        }
      } catch (error) {
        console.error('Error deleting document:', error);
        setError('Network error while deleting document');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading documents...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="document-history">
      <h2>Document History</h2>
      
      <div className="history-container">
        <div className="document-list">
          <h3>Your Documents ({documents.length})</h3>
          {documents.length === 0 ? (
            <div className="no-documents">
              <p>No documents uploaded yet.</p>
              <p>Start by uploading your first medical document!</p>
            </div>
          ) : (
            <ul>
              {documents.map(doc => (
                <li key={doc.id} className="document-item" onClick={() => handleDocumentClick(doc.id)}>
                  <div className="document-info">
                    <h4>{doc.original_filename}</h4>
                    <p className="upload-date">{formatDate(doc.upload_date)}</p>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteDocument(doc.id, e)}
                    className="delete-btn"
                    title="Delete document"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="document-details">
          {selectedDocument ? (
            <div className="summary-display">
              <h3>Summary: {selectedDocument.original_filename}</h3>
              <div className="summary-date">
                Uploaded: {formatDate(selectedDocument.upload_date)}
              </div>
              
              <div className="summary-content">
                {selectedDocument.summary ? (
                  <div className="summary-sections">
                    {selectedDocument.summary.patientInfo && (
                      <div className="section">
                        <h4>Patient Information</h4>
                        <div className="info-grid">
                          {selectedDocument.summary.patientInfo.name && (
                            <p><strong>Name:</strong> {selectedDocument.summary.patientInfo.name}</p>
                          )}
                          {selectedDocument.summary.patientInfo.dob && (
                            <p><strong>DOB:</strong> {selectedDocument.summary.patientInfo.dob}</p>
                          )}
                          {selectedDocument.summary.patientInfo.address && (
                            <p><strong>Address:</strong> {selectedDocument.summary.patientInfo.address}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedDocument.summary.injury && (
                      <div className="section">
                        <h4>Injury Information</h4>
                        <div className="info-grid">
                          {selectedDocument.summary.injury.date && (
                            <p><strong>Date:</strong> {selectedDocument.summary.injury.date}</p>
                          )}
                          {selectedDocument.summary.injury.mechanism && (
                            <p><strong>Mechanism:</strong> {selectedDocument.summary.injury.mechanism}</p>
                          )}
                          {selectedDocument.summary.injury.details && (
                            <p><strong>Details:</strong> {selectedDocument.summary.injury.details}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedDocument.summary.medicalHistory && selectedDocument.summary.medicalHistory.length > 0 && (
                      <div className="section">
                        <h4>Medical History</h4>
                        <ul>
                          {selectedDocument.summary.medicalHistory.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedDocument.summary.treatments && selectedDocument.summary.treatments.length > 0 && (
                      <div className="section">
                        <h4>Treatments</h4>
                        {selectedDocument.summary.treatments.map((treatment, index) => (
                          <div key={index} className="treatment">
                            <p><strong>Type:</strong> {treatment.type}</p>
                            <p><strong>Details:</strong> {treatment.details}</p>
                            {treatment.providers && treatment.providers.length > 0 && (
                              <p><strong>Providers:</strong> {treatment.providers.join(', ')}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedDocument.summary.careHistory && selectedDocument.summary.careHistory.length > 0 && (
                      <div className="section">
                        <h4>Care History</h4>
                        {selectedDocument.summary.careHistory.map((visit, index) => (
                          <div key={index} className="care-visit">
                            <p><strong>Date:</strong> {visit.date}</p>
                            {visit.provider && <p><strong>Provider:</strong> {visit.provider}</p>}
                            {visit.findings && <p><strong>Findings:</strong> {visit.findings}</p>}
                            {visit.recommendations && <p><strong>Recommendations:</strong> {visit.recommendations}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedDocument.summary.imaging && selectedDocument.summary.imaging.length > 0 && (
                      <div className="section">
                        <h4>Imaging</h4>
                        {selectedDocument.summary.imaging.map((image, index) => (
                          <div key={index} className="imaging-item">
                            <p><strong>Type:</strong> {image.type}</p>
                            <p><strong>Date:</strong> {image.date}</p>
                            {image.facility && <p><strong>Facility:</strong> {image.facility}</p>}
                            {image.findings && <p><strong>Findings:</strong> {image.findings}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedDocument.summary.recommendations && selectedDocument.summary.recommendations.length > 0 && (
                      <div className="section">
                        <h4>Recommendations</h4>
                        <ul>
                          {selectedDocument.summary.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedDocument.summary.issues && selectedDocument.summary.issues.length > 0 && (
                      <div className="section issues-section">
                        <h4>Issues and Ambiguities</h4>
                        <ul>
                          {selectedDocument.summary.issues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedDocument.summary.prognosis && (
                      <div className="section">
                        <h4>Prognosis</h4>
                        <p>{selectedDocument.summary.prognosis}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="no-summary">
                    <p>No summary available for this document.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Select a document from the list to view its summary.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentHistory;
