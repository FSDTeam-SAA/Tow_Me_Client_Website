import React from 'react';
import { ClipboardList, Truck, CheckCircle2 } from 'lucide-react';
import './HowItWorks.css';

const STEPS = [
  {
    stepNumber: '1',
    icon: ClipboardList,
    title: 'מלא פרטים',
    description: 'מלא מיקום סוג הרכב — זה יקח פחות מדקה'
  },
  {
    stepNumber: '2',
    icon: Truck,
    title: 'בחר גורר/טכנאי',
    description: 'בחר מתוך מגוון גוררים זמינים עם דירוגים ומחירים שקופים'
  },
  {
    stepNumber: '3',
    icon: CheckCircle2,
    title: 'קבל שירות',
    description: 'הגורר מגיע אליך בזמן שנקבע ועוזר לך מיד'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="text-center">
          <span className="badge-pill badge-orange-pill">פשוט ומהיר</span>
          <h2 className="section-title">איך זה עובד?</h2>
          <p className="section-subtitle">3 צעדים פשוטים</p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="steps-grid">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.stepNumber} className="step-card">
                
                {/* Number Circle Badge */}
                <div className="step-number-circle">
                  {step.stepNumber}
                </div>

                {/* Card Icon */}
                <div className="step-icon-wrapper">
                  <Icon className="step-icon text-teal" />
                </div>

                {/* Content */}
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
