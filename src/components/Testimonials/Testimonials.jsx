import React from 'react';
import { Star } from 'lucide-react';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';
import './Testimonials.css';

const REVIEWS = [
  {
    id: 1,
    name: 'יוסי אברהם',
    role: 'רחובות',
    stars: 5,
    comment: '"נתקעתי בכביש 1 בלילה והגורר TOW ME הגיע תוך 12 דקות! בדיוק בזמן! יחס אדיב, מחיר הוגן, ומקצועי מאוד. ממליץ בחום!"',
    isFeatured: false
  },
  {
    id: 2,
    name: 'מיכאל כהן',
    role: 'חיפה',
    stars: 5,
    comment: '"הזמנתי קריאה מתוך האפליקציה: TOW ME שלחו גורר תוך 10 דקות! המחיר היה שקוף מראש ולא היו הפתעות. בדיוק מה שהייתי צריך!"',
    isFeatured: true // Featured dark blue card matching the middle card in image
  },
  {
    id: 3,
    name: 'דני לוי',
    role: 'תל אביב',
    stars: 5,
    comment: '"התקשרתי בשישי בערב וחולצתי במהירות. 5 כוכבים, מגיע להם! גרר חדש, מקצועי ונחמד מאוד. ממליץ!"',
    isFeatured: false
  }
];

export default function Testimonials() {
  return (
    <section id="reviews" className="testimonials-section">
      <div className="container">
        
        {/* Header */}
        <div className="text-center">
          <span className="badge-pill badge-yellow-pill">המלצות ומחמאות</span>
          <h2 className="section-title">לקוחות מרוצים</h2>
          <p className="section-subtitle">מה אומרים עלינו</p>
        </div>

        {/* 3 Review Cards Grid */}
        <div className="testimonials-grid">
          {REVIEWS.map((review) => (
            <div 
              key={review.id} 
              className={`testimonial-card ${review.isFeatured ? 'featured-card' : ''}`}
            >
              
              {/* Star Rating */}
              <div className="stars-row">
                {[...Array(review.stars)].map((_, i) => (
                  <Star key={i} className="star-icon" />
                ))}
              </div>

              {/* Comment text */}
              <p className="testimonial-text">{review.comment}</p>

              {/* User Profile Footer */}
              <div className="testimonial-user flex items-center gap-3">
                {/* User Avatar Placeholder Frame Slot */}
                <div className="user-avatar-slot">
                  <ImagePlaceholder 
                    label="User Avatar Photo Slot" 
                    width="44px" 
                    height="44px" 
                    className="avatar-placeholder"
                  />
                </div>

                <div className="user-details">
                  <h4 className="user-name">{review.name}</h4>
                  <span className="user-role">{review.role}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
