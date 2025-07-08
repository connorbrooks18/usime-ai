import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <nav className="navbar">
      <div className="logo">
        <h1>USIME.AI</h1>
      </div>
      <div className="main-nav">
        <ul>
          <li><Link to="/upload" className={location.pathname === '/upload' || location.pathname === '/' ? 'active' : ''}>Upload</Link></li>
          <li><Link to="/history" className={location.pathname === '/history' ? 'active' : ''}>History</Link></li>
        </ul>
      </div>
      <div className="auth-section">
        {user ? (
          <div className="user-info">
            <span>Welcome, {user.username}!</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
