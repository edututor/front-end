import React, { useState } from 'react';
import '../styles/Navbar.css';

const Navbar = ({ toggleTheme, isDarkMode }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>EduTutor</h1>
      </div>
      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 