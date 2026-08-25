import React from 'react';
import { Phone, Mail, Clock } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="container">
        
        {/* Top Footer Columns */}
        <div className="footer-top-grid">
          
          {/* Col 1: Brand & Tagline */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <span className="brand-dot"></span>
              <span className="brand-name">
                <span className="text-orange">TOW</span> ME
              </span>
            </div>
            <p className="footer-tagline">
              שירותי גרירה וחילוץ 24 שעות ביממה בכל חלקי הארץ. מעקב בזמן אמת, מחירים שקופים וצוות מקצועי.
            </p>
            {/* Social Icon Placeholders */}
            <div className="social-placeholders">
              <div className="social-icon-box" title="Social Slot 1">f</div>
              <div className="social-icon-box" title="Social Slot 2">in</div>
              <div className="social-icon-box" title="Social Slot 3">ig</div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="footer-col">
            <h4 className="footer-title">שירותים</h4>
            <ul className="footer-links">
              <li><a href="#services">גרירת רכב פרטי</a></li>
              <li><a href="#services">חילוץ דרך ושטח</a></li>
              <li><a href="#services">טעינת מצבר והחלפה</a></li>
              <li><a href="#services">החלפת גלגל ותקר</a></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="footer-col">
            <h4 className="footer-title">חברה</h4>
            <ul className="footer-links">
              <li><a href="#about">אודות TOW ME</a></li>
              <li><a href="#how-it-works">איך זה עובד</a></li>
              <li><a href="#reviews">המלצות לקוחות</a></li>
              <li><a href="#terms">תנאי שימוש ופרטיות</a></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="footer-col contact-col">
            <h4 className="footer-title">יצירת קשר</h4>
            <div className="contact-items">
              <div className="contact-row">
                <Phone className="contact-icon" />
                <span>1-800-TOW-ME (מוקד חירום)</span>
              </div>
              <div className="contact-row">
                <Mail className="contact-icon" />
                <span>info@towme.co.il</span>
              </div>
              <div className="contact-row">
                <Clock className="contact-icon" />
                <span>24/7 זמין בכל הארץ</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar flex items-center justify-between">
          <div className="copyright-text">
            © כל הזכויות שמורות ל-TOW ME {new Date().getFullYear()} • שירותי גרירה מתקדמים
          </div>
          <div className="legal-links flex gap-4">
            <a href="#privacy">מדיניות פרטיות</a>
            <a href="#terms">תנאי שימוש</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
