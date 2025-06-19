import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DocumentUpload from './pages/DocumentUpload';
// import your other pages here

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Redirect from root to document upload */}
        <Route path="/" element={<Navigate to="/upload" replace />} />
        
        {/* Your existing routes */}
        <Route path="/upload" element={<DocumentUpload />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;