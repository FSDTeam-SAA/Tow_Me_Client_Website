import React from 'react';
import './StatsBar.css';

const STATS = [
  { value: '2,500+', label: 'גרירות בחודש' },
  { value: '4.9★', label: 'דירוג ממוצע' },
  { value: "15 דק'", label: 'זמן הגעה ממוצע' },
  { value: '200+', label: 'גרריסטים מוסמכים' }
];

export default function StatsBar() {
  return (
    <section className="stats-bar-section">
      <div className="container">
        
        <div className="stats-bar-card">
          <div className="stats-grid">
            {STATS.map((stat, idx) => (
              <div key={idx} className="stat-item">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
