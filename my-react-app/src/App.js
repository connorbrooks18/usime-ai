import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import DocumentUpload from './pages/DocumentUpload';
import DocumentHistory from './components/DocumentHistory';
import CreateIme from './pages/CreateIme';
import ImeHistory from './pages/ImeHistory';
import AuthPage from './components/Auth';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Main App component
const AppContent = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="App">
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          user ? <Navigate to="/upload" replace /> : <AuthPage />
        } />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Navigate to="/upload" replace />
          </ProtectedRoute>
        } />
        
        <Route path="/upload" element={
          <ProtectedRoute>
            <DocumentUpload />
          </ProtectedRoute>
        } />
        
        <Route path="/history" element={
          <ProtectedRoute>
            <DocumentHistory />
          </ProtectedRoute>
        } />
        
        <Route path="/ime" element={
          <ProtectedRoute>
            <CreateIme />
          </ProtectedRoute>
        } />
        
        <Route path="/ime-history" element={
          <ProtectedRoute>
            <ImeHistory />
          </ProtectedRoute>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/upload" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;