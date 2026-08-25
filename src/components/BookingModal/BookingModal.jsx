import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import './BookingModal.css';

export default function BookingModal({ isOpen, onClose, initialData = {} }) {
  const [step, setStep] = useState(1);
  const [pickup, setPickup] = useState(initialData.pickup || 'כביש 1, מחלף שער הגיא');
  const [dropoff, setDropoff] = useState(initialData.dropoff || 'מוסך מרכזי תל אביב');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone) {
      alert('נא להזין מספר טלפון לחזרה');
      return;
    }
    setStep(2);
  };

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal-card">
        
        {/* Modal Header */}
        <div className="booking-modal-header">
          <h3 className="modal-title font-black">
            {step === 1 ? 'הזמנת שירות גרירה' : 'הזמנה התקבלה בהצלחה!'}
          </h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="booking-modal-body">
            
            <div className="form-group">
              <label className="form-label">מיקום איסוף</label>
              <input
                type="text"
                required
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="hero-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">מיקום יעד (אופציונלי)</label>
              <input
                type="text"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="hero-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">מספר טלפון ליצירת קשר *</label>
              <input
                type="tel"
                required
                placeholder="050-0000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="hero-input"
              />
            </div>

            <button type="submit" className="btn-orange w-full py-3 mt-4">
              <span>אישור ושליחת קריאה לגרר</span>
              <ArrowLeft className="w-4 h-4 mr-2" />
            </button>

          </form>
        ) : (
          <div className="booking-success-body text-center space-y-4 py-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h4 className="text-xl font-black text-slate-800">הגורר בדרך אליך!</h4>
            <p className="text-sm text-slate-600">
              נהג גרר שובץ לקריאה שלך ויגיע תוך כ-12 דקות. נשלח אליך מסרון SMS עם קישור למעקב במפה.
            </p>
            <button onClick={onClose} className="btn-orange w-full py-3">
              סגור חלון
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
