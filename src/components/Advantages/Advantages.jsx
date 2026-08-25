import React from 'react';
import { Clock3, WalletCards, MapPin, CheckCircle2 } from 'lucide-react';
import './Advantages.css';

const ADVANTAGES = [
  {
    icon: Clock3,
    title: "הגעה תוך 15 דק'",
    description: 'פריסה ארצית מאפשרת לנו להגיע אליך במהירות שיא – בכל מקום בארץ, בכל שעה',
    badgeText: 'זמן תגובה מובטח',
    badgeType: 'orange'
  },
  {
    icon: WalletCards,
    title: 'תשלום מאובטח',
    description: 'תשלום נוח ומאובטח דרך האפליקציה, שקיפות מלאה במחיר – ללא הפתעות',
    badgeText: '',
    badgeType: ''
  },
  {
    icon: MapPin,
    title: 'מעקב בזמן אמת',
    description: 'ראה את הגרר מתקרב אליך על המפה בזמן אמת – דע בדיוק מתי הוא מגיע',
    badgeText: 'עדכונים חיים',
    badgeType: 'blue'
  }
];

export default function Advantages() {
  return (
    <section id="about" className="advantages-section">
      <div className="container">
        
        {/* Header */}
        <div className="text-center">
          <span className="badge-pill badge-blue-pill">למה אנחנו?</span>
          <h2 className="section-title">היתרונות שלנו</h2>
          <p className="section-subtitle">מה מייחד את TOW ME</p>
        </div>

        {/* Grid of 3 Cards */}
        <div className="advantages-grid">
          {ADVANTAGES.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="advantage-card">
                
                {/* Floating Top Circle Icon */}
                <div className="advantage-icon-circle">
                  <Icon className="advantage-icon" />
                </div>

                {/* Content */}
                <h3 className="advantage-title">{item.title}</h3>
                <p className="advantage-description">{item.description}</p>
                
                {/* Footer Tag */}
                {item.badgeText ? (
                  <div className="advantage-footer">
                    <span className={`advantage-tag tag-${item.badgeType}`}>
                      <CheckCircle2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }} />
                      {item.badgeText}
                    </span>
                  </div>
                ) : (
                  <div className="advantage-footer-placeholder" style={{ height: '24px' }} />
                )}

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
