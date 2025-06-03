import React, { useState } from 'react';
import './CreateIme.css';

/**
 * CreateIme Component
 * 
 * This component renders a form for lawyers to submit Independent Medical Examination (IME) reports.
 * It collects case information, patient details, attorney information, and allows for PDF uploads.
 * The form includes HIPAA compliance notices and consent requirements.
 */
function CreateIme() {
  // ==================== STATE MANAGEMENT ====================
  
  /**
   * Main form data state
   * 
   * This state object stores all form field values. It uses a single object
   * to make it easier to handle form submission and reset functionality.
   * Each property corresponds to a form field.
   */
  const [formData, setFormData] = useState({
    caseNumber: '',        // Unique identifier for the legal case
    patientName: '',       // Full name of the patient (PHI - protected health information)
    patientDOB: '',        // Patient date of birth (PHI)
    insuranceCompany: '',  // Relevant insurance company name
    attorneyName: '',      // Name of the submitting attorney
    attorneyEmail: '',     // Contact email of the attorney
    attorneyPhone: '',     // Contact phone number of the attorney
    injuryType: '',        // Type of injury from predefined list
    injuryDate: '',        // Date when the injury occurred
    additionalNotes: '',   // Any supplementary information
    files: [],             // Array of File objects (PDFs of medical records)
    privacyConsent: false  // Boolean flag for HIPAA consent checkbox
  });
  
  /**
   * Form submission state
   * 
   * Tracks whether the form is currently in the process of being submitted.
   * Used to disable the submit button and show loading state.
   */
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * Submission feedback message
   * 
   * Stores success or error messages to display to the user after form submission.
   * Empty string means no message should be displayed.
   */
  const [submitMessage, setSubmitMessage] = useState('');
  
  /**
   * File names state
   * 
   * Stores the names of uploaded files for display in the UI.
   * This is separate from the actual File objects stored in formData.files
   * to make it easier to display and remove files from the list.
   */
  const [fileNames, setFileNames] = useState([]);

  // ==================== EVENT HANDLERS ====================
  
  /**
   * Handle changes to text inputs, selects, and textareas
   * 
   * This function updates the formData state when the user types in a text field,
   * selects an option from a dropdown, or enters text in a textarea.
   * 
   * @param {Event} e - The input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,        // Spread the existing form data
      [name]: value       // Update only the changed field using computed property name
    });
  };

  /**
   * Handle file uploads
   * 
   * This function processes file uploads when the user selects files.
   * It updates both the formData.files array with the actual File objects
   * and the fileNames array with the names of the files for display.
   * 
   * @param {Event} e - The file input change event
   */
  const handleFileChange = (e) => {
    // Convert FileList object to Array for easier manipulation
    const selectedFiles = Array.from(e.target.files);
    
    // Update formData.files with new files while preserving existing ones
    setFormData({
      ...formData,
      files: [...formData.files, ...selectedFiles]
    });
    
    // Extract just the file names for display purposes
    const newFileNames = selectedFiles.map(file => file.name);
    setFileNames([...fileNames, ...newFileNames]);
  };

  /**
   * Remove a file from the uploaded files list
   * 
   * This function removes a file from both the formData.files array
   * and the fileNames array when the user clicks the Remove button.
   * 
   * @param {Number} indexToRemove - The index of the file to remove
   */
  const removeFile = (indexToRemove) => {
    setFormData({
      ...formData,
      files: formData.files.filter((_, index) => index !== indexToRemove)
    });
    
    setFileNames(fileNames.filter((_, index) => index !== indexToRemove));
  };

  /**
   * Handle checkbox changes (specifically for the privacy consent checkbox)
   * 
   * This function updates the formData state when the user checks or unchecks
   * the privacy consent checkbox.
   * 
   * @param {Event} e - The checkbox change event
   */
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked     // Update with boolean checked value instead of string value
    });
  };

  /**
   * Handle form submission
   * 
   * This function processes the form submission when the user clicks the Submit button.
   * It validates the form data, logs it to the console (for development),
   * and resets the form on successful submission.
   * 
   * In production, this would send the data to a backend API.
   * 
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();      // Prevent default form submission behavior
    setIsSubmitting(true);   // Enable loading state
    setSubmitMessage('');    // Clear any previous messages
    
    try {
      // For development/testing: just log the data to console
      // This replaces an actual API call for now
      console.log('Form Data Submitted:', {
        ...formData,
        // Format file information for easier reading in console
        files: formData.files.map(file => ({
          name: file.name,
          type: file.type,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`  // Convert bytes to MB
        }))
      });
      
      // Simulate network delay for better UX testing
      // In production, this would be a real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message to the user
      setSubmitMessage('IME successfully submitted! A doctor will review your case shortly.');
      
      // Reset form after successful submission
      setFormData({
        caseNumber: '',
        patientName: '',
        patientDOB: '',
        insuranceCompany: '',
        attorneyName: '',
        attorneyEmail: '',
        attorneyPhone: '',
        injuryType: '',
        injuryDate: '',
        additionalNotes: '',
        files: [],
        privacyConsent: false
      });
      setFileNames([]);  // Also clear the displayed file names
      
    } catch (error) {
      // Handle any errors that occur during submission
      console.error('Error in form submission:', error);
      setSubmitMessage('An error occurred. Please try again.');
    } finally {
      // Always disable loading state when done, whether successful or not
      setIsSubmitting(false);
    }
  };

  // ==================== COMPONENT DATA ====================
  
  /**
   * Predefined list of injury types for the dropdown menu
   */
  const injuryTypes = [
    "Motor Vehicle Accident",
    "Slip and Fall",
    "Work-related Injury",
    "Medical Malpractice",
    "Product Liability",
    "Sports Injury",
    "Assault",
    "Other"
  ];

  // ==================== COMPONENT RENDER ====================
  return (
    <div className="create-ime-page">
      <h1>Submit Independent Medical Examination (IME)</h1>
      
      <div className="ime-form-container">
        {/* Conditional rendering of success/error message */}
        {submitMessage && (
          <div className={`submission-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
            {submitMessage}
          </div>
        )}
        
        {/* Main form with onSubmit handler */}
        <form className="ime-form" onSubmit={handleSubmit}>
          {/* Case Information Section */}
          <div className="form-section">
            <h2>Case Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="caseNumber">Case Number</label>
                <input 
                  type="text" 
                  id="caseNumber" 
                  name="caseNumber" 
                  value={formData.caseNumber}
                  onChange={handleInputChange}
                  placeholder="Enter case number" 
                  required  // HTML5 validation
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="insuranceCompany">Insurance Company</label>
                <input 
                  type="text" 
                  id="insuranceCompany" 
                  name="insuranceCompany" 
                  value={formData.insuranceCompany}
                  onChange={handleInputChange}
                  placeholder="Insurance company name" 
                />
              </div>
            </div>
          </div>
          
          {/* Patient Information Section - Contains PHI (Protected Health Information) */}
          <div className="form-section">
            <h2>Patient Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="patientName">Patient Name</label>
                <input 
                  type="text" 
                  id="patientName" 
                  name="patientName" 
                  value={formData.patientName}
                  onChange={handleInputChange}
                  placeholder="Full name of patient" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="patientDOB">Date of Birth</label>
                <input 
                  type="date" 
                  id="patientDOB" 
                  name="patientDOB" 
                  value={formData.patientDOB}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="injuryType">Injury Type</label>
                <select 
                  id="injuryType" 
                  name="injuryType" 
                  value={formData.injuryType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select injury type</option>
                  {/* Dynamically generate options from injuryTypes array */}
                  {injuryTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="injuryDate">Date of Injury</label>
                <input 
                  type="date" 
                  id="injuryDate" 
                  name="injuryDate" 
                  value={formData.injuryDate}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>
          </div>
          
          {/* Attorney Information Section */}
          <div className="form-section">
            <h2>Attorney Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="attorneyName">Attorney Name</label>
                <input 
                  type="text" 
                  id="attorneyName" 
                  name="attorneyName" 
                  value={formData.attorneyName}
                  onChange={handleInputChange}
                  placeholder="Your full name" 
                  required 
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="attorneyEmail">Email</label>
                <input 
                  type="email"  // Provides email validation
                  id="attorneyEmail" 
                  name="attorneyEmail" 
                  value={formData.attorneyEmail}
                  onChange={handleInputChange}
                  placeholder="Your email address" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="attorneyPhone">Phone</label>
                <input 
                  type="tel"  // Appropriate for phone numbers
                  id="attorneyPhone" 
                  name="attorneyPhone" 
                  value={formData.attorneyPhone}
                  onChange={handleInputChange}
                  placeholder="Your phone number" 
                  required 
                />
              </div>
            </div>
          </div>
          
          {/* Medical Records Upload Section */}
          <div className="form-section">
            <h2>Medical Records</h2>
            
            <div className="form-group file-upload-container">
              <label htmlFor="filesUpload">Upload Medical Records (PDF)</label>
              <div className="file-upload-wrapper">
                <input 
                  type="file" 
                  id="filesUpload" 
                  name="filesUpload"
                  accept=".pdf"  // Restrict to PDF files only
                  multiple       // Allow multiple file selection
                  onChange={handleFileChange}
                  className="file-input"
                />
                <div className="file-upload-button">
                  <span>Select Files</span>
                </div>
              </div>
              <p className="upload-help-text">Maximum file size: 100MB per file. You can upload multiple files.</p>
            </div>
            
            {/* Conditionally render the list of uploaded files */}
            {fileNames.length > 0 && (
              <div className="uploaded-files">
                <h4>Uploaded Files:</h4>
                <ul>
                  {fileNames.map((name, index) => (
                    <li key={index}>
                      <span className="file-name">{name}</span>
                      <button 
                        type="button"  // Prevents form submission
                        className="remove-file-btn"
                        onClick={() => removeFile(index)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="additionalNotes">Additional Notes</label>
              <textarea 
                id="additionalNotes" 
                name="additionalNotes" 
                value={formData.additionalNotes}
                onChange={handleInputChange}
                rows="5" 
                placeholder="Any additional information relevant to the case..."
              ></textarea>
            </div>
          </div>
          
          {/* Privacy and Consent Section - HIPAA Compliance */}
          <div className="form-section privacy-section">
            <h2>Privacy and Consent</h2>
            
            <div className="privacy-notice">
              <p>Important: All patient information will be handled in accordance with HIPAA regulations.</p>
              <ul>
                <li>All data will be encrypted at rest and in transit</li>
                <li>Access is restricted to authorized medical professionals only</li>
                <li>Data will only be used for the purpose of completing the requested IME</li>
                <li>You must have proper authorization to submit this medical information</li>
              </ul>
            </div>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  id="privacyConsent" 
                  name="privacyConsent" 
                  checked={formData.privacyConsent}
                  onChange={handleCheckboxChange}
                  required 
                />
                <span className="checkmark"></span>
                I confirm that I have legal authorization to submit this medical information and consent to its processing for the purpose of generating an IME report
              </label>
            </div>
          </div>
          
          {/* Form Submission Section */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              // Disable button if:
              // 1. Form is currently submitting
              // 2. No files have been uploaded
              // 3. Privacy consent hasn't been checked
              disabled={isSubmitting || formData.files.length === 0 || !formData.privacyConsent}
            >
              {isSubmitting ? 'Submitting...' : 'Submit IME'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateIme;
