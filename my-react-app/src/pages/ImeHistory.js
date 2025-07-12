import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ImeHistory.css';

const ImeHistory = () => {
  const [imeReports, setImeReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchImeReports();
  }, []);

  const fetchImeReports = async () => {
    try {
      const response = await fetch('/api/ime-reports', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setImeReports(data);
      } else {
        setError('Failed to fetch IME reports');
      }
    } catch (error) {
      console.error('Error fetching IME reports:', error);
      setError('Network error while fetching IME reports');
    } finally {
      setLoading(false);
    }
  };

  const handleReportClick = async (reportId) => {
    try {
      const response = await fetch(`/api/ime-reports/${reportId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setSelectedReport(data);
      } else {
        setError('Failed to fetch IME report details');
      }
    } catch (error) {
      console.error('Error fetching IME report:', error);
      setError('Network error while fetching IME report');
    }
  };

  const handleDeleteReport = async (reportId, event) => {
    event.stopPropagation(); // Prevent report selection when clicking delete
    
    if (window.confirm('Are you sure you want to delete this IME report?')) {
      try {
        const response = await fetch(`/api/ime-reports/${reportId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (response.ok) {
          setImeReports(imeReports.filter(report => report.id !== reportId));
          if (selectedReport && selectedReport.id === reportId) {
            setSelectedReport(null);
          }
        } else {
          setError('Failed to delete IME report');
        }
      } catch (error) {
        console.error('Error deleting IME report:', error);
        setError('Network error while deleting IME report');
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
    return <div className="loading">Loading IME reports...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="ime-history-page">
      <div className="history-container">
        <h1>IME Report History</h1>
        
        <div className="history-content">
          <div className="report-list">
            <h3>Your IME Reports ({imeReports.length})</h3>
            {imeReports.length === 0 ? (
              <div className="no-reports">
                <p>No IME reports generated yet.</p>
                <p>Start by creating your first IME report!</p>
                <Link to="/ime" className="create-ime-link">Create IME Report</Link>
              </div>
            ) : (
              <ul>
                {imeReports.map(report => (
                  <li key={report.id} className="report-item" onClick={() => handleReportClick(report.id)}>
                    <div className="report-info">
                      <h4>{report.title}</h4>
                      <p className="document-name">Based on: {report.document_name}</p>
                      <p className="created-date">{formatDate(report.created_at)}</p>
                    </div>
                    <button 
                      onClick={(e) => handleDeleteReport(report.id, e)}
                      className="delete-btn"
                      title="Delete IME report"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="report-details">
            {selectedReport ? (
              <div className="report-display">
                <h3>{selectedReport.title}</h3>
                <div className="report-meta">
                  <p><strong>Document:</strong> {selectedReport.document_name}</p>
                  <p><strong>Created:</strong> {formatDate(selectedReport.created_at)}</p>
                </div>
                
                <div className="report-sections">
                  {/* Interview Notes Section */}
                  <div className="section">
                    <h4>Interview Notes</h4>
                    <div className="section-content">
                      {selectedReport.interview_notes.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  </div>

                  {/* Legal Questions Section */}
                  <div className="section">
                    <h4>Legal Questions</h4>
                    <div className="section-content">
                      {selectedReport.questions.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  </div>

                  {/* Confusions Section */}
                  {selectedReport.confusions && (
                    <div className="section">
                      <h4>Confusions and Contradictions</h4>
                      <div className="section-content confusions">
                        {selectedReport.confusions.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* IME Report Section */}
                  <div className="section">
                    <h4>IME Report</h4>
                    <div className="section-content report">
                      {selectedReport.report.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="report-actions">
                  <button 
                    onClick={() => window.print()}
                    className="print-btn"
                  >
                    Print Report
                  </button>
                  <button 
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(selectedReport, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `ime-report-${selectedReport.id}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="download-btn"
                  >
                    Download JSON
                  </button>
                </div>
              </div>
            ) : (
              <div className="no-selection">
                <p>Select an IME report from the list to view its details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImeHistory; 