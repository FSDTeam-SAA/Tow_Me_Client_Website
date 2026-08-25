import React, { useState } from 'react';
import { MapPin, Navigation, ArrowLeft, Star, Clock, ShieldCheck, Search, AlertTriangle, Disc } from 'lucide-react';
import heroBgImg from '../../assets/Images/background_header_image.png';
import upperImg from '../../assets/Images/background_image_upper.png';
import './HeroSection.css';

export default function HeroSection({ onSearchTow }) {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [issueType, setIssueType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchTow) {
      onSearchTow({ pickup, dropoff, issueType });
    }
  };

  const handleGpsDetect = () => {
    setPickup('מיקום GPS נוכחי (זיהוי אוטומטי)');
  };

  return (
    <section className="hero-section">
      
      {/* Background Image Container using background_header_image.png */}
      <div 
        className="hero-bg-image" 
        style={{ backgroundImage: `url(${heroBgImg})` }}
      />
      <div className="hero-overlay"></div>

      <div className="container hero-container">
        
        {/* Right Side: Headline Text & Badges (RTL) */}
        <div className="hero-content">
          <h1 className="hero-title">
            תקועים?<br />
            <span className="text-orange-glow">אנחנו בדרך!</span>
          </h1>

          <p className="hero-subtitle">
            שירות גרר מהיר, אמין ומאובטח –<br />
            מגיעים אליך תוך <span className="highlight-text">15 דקות</span>.
          </p>

          {/* 4 Stat Badges matching the image */}
          <div className="hero-badges font-heading">
            <div className="hero-badge-item">
              <Star className="badge-icon text-yellow fill-yellow-400" />
              <span>4.9/5 דירוג</span>
            </div>
            <div className="hero-badge-item">
              <ShieldCheck className="badge-icon text-green" />
              <span>מבוטח</span>
            </div>
            <div className="hero-badge-item">
              <Clock className="badge-icon text-cyan" />
              <span>24/7 זמין</span>
            </div>
            <div className="hero-badge-item">
              <span className="text-orange font-bold">+2,000 גרירות</span>
            </div>
          </div>
        </div>

        {/* Left Side: Floating Booking Card */}
        <div className="hero-form-card">
          <div className="card-header font-heading">
            <div className="header-icon-blue">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span>הזמן גרר עכשיו</span>
          </div>

          <form onSubmit={handleSubmit} className="card-body">
            
            {/* Field 1: Pickup */}
            <div className="form-group">
              <label className="form-label">מיקום נוכחי</label>
              <div className="input-with-icon">
                <Disc className="field-icon text-red-500" />
                <input 
                  type="text" 
                  value={pickup} 
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="זהה מיקום אוטומטית" 
                  className="hero-input"
                  required
                />
                <button 
                  type="button" 
                  onClick={handleGpsDetect}
                  className="gps-pill-btn"
                >
                  GPS
                </button>
              </div>
            </div>

            {/* Field 2: Dropoff */}
            <div className="form-group">
              <label className="form-label">יעד (אופציונלי)</label>
              <div className="input-with-icon">
                <Navigation className="field-icon text-slate-400" />
                <input 
                  type="text" 
                  value={dropoff} 
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder="הכנס כתובת יעד..." 
                  className="hero-input"
                />
              </div>
            </div>

            {/* Field 3: Issue Type Dropdown */}
            <div className="form-group">
              <label className="form-label">סוג תקלה</label>
              <div className="input-with-icon">
                <AlertTriangle className="field-icon text-orange-500" />
                <select 
                  value={issueType} 
                  onChange={(e) => setIssueType(e.target.value)}
                  className="hero-select"
                  required
                >
                  <option value="">בחר סוג תקלה</option>
                  <option value="tire">🔧 תקר (פנצ'ר)</option>
                  <option value="accident">🚗 תאונה</option>
                  <option value="engine">⚙️ תקלת מנוע</option>
                  <option value="other">❓ אחר</option>
                </select>
              </div>
            </div>

            {/* Form Submit Button */}
            <button type="submit" className="btn-orange form-submit-btn">
              <Search className="w-4 h-4 ml-1.5" />
              <span>חפש גריריסטים זמינים</span>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
            </button>

            <div className="form-footer-note">
              ללא התחייבות • מחיר שקוף • שירות 24/7
            </div>

          </form>
        </div>

      </div>

      {/* Floating Rescuer Image (background_image_upper.png) matching the blue box in user screenshot */}
      <div className="hero-upper-img-wrap">
        <img 
          src={upperImg} 
          alt="TOW ME Rescue Worker & Car" 
          className="hero-upper-img"
        />
      </div>

    </section>
  );
}
