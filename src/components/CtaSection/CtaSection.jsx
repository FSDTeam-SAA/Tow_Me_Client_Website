import React from 'react';
import { ArrowLeft } from 'lucide-react';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';
import './CtaSection.css';

export default function CtaSection({ onBookClick }) {
  return (
    <section className="cta-section">
      <div className="container">
        
        <div className="cta-card flex items-center justify-between">
          
          {/* Right Side (RTL): Text & Button */}
          <div className="cta-content">
            <h2 className="cta-heading">תקועים? אנחנו כאן 24/7</h2>
            <p className="cta-subheading">
              קבל עזרה מיידית — גוררים מוסמכים ומקצועיים בכל רחבי הארץ
            </p>

            <div className="cta-action-area">
              <button onClick={onBookClick} className="cta-btn">
                <span>הזמן גרר עכשיו</span>
                <ArrowLeft className="w-5 h-5 mr-2" />
              </button>
              <span className="cta-note">ללא הרשמה מראש • שירות מיידי</span>
            </div>
          </div>

          {/* Left Side (RTL): Tow Truck Image Container Slot */}
          <div className="cta-image-slot">
            <ImagePlaceholder 
              label="Tow Truck & Driver Photo Slot" 
              height="260px" 
              width="100%" 
            />
          </div>

        </div>

      </div>
    </section>
  );
}
