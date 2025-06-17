import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="logo">
        <h1>USIME.AI</h1>
      </div>
      <div className="main-nav">
        <ul>          <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
          <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link></li>
          <li><Link to="/document-upload" className={location.pathname === '/document-upload' ? 'active' : ''}>Document Upload</Link></li>
          <li><Link to="/create-ime" className={location.pathname === '/create-ime' ? 'active' : ''}>Submit IME</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
