import React from 'react';
import { MapPin, ArrowLeft } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onBookClick }) {
  return (
    <header className="navbar-header">
      {/* Top Orange Line */}
      <div className="top-orange-line" />

      <div className="container navbar-container">
        
        {/* Right side Logo */}
        <div className="navbar-brand">
          <div className="brand-icon-wrap">
            <MapPin className="w-5 h-5 text-orange" />
          </div>
          <span className="brand-name">
            <span className="text-orange">TOW</span> <span className="text-navy">ME</span>
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="navbar-links">
          <a href="#services">שירותים</a>
          <a href="#about">אודות</a>
          <a href="#contact">יצירת קשר</a>
          <a href="#login">כניסה לחשבון</a>
        </nav>

        {/* Left Side CTA Button */}
        <div className="navbar-actions">
          <button onClick={onBookClick} className="btn-orange navbar-btn">
            <span>הזמן גרר עכשיו</span>
            <ArrowLeft className="w-4 h-4 mr-1" />
          </button>
        </div>

      </div>
    </header>
  );
}
