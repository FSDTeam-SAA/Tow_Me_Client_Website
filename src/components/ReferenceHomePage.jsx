import { useState } from 'react'
import {
  AlertTriangle, ArrowLeft, Car, Check, CheckCircle2, Clock3,
  LocateFixed, LockKeyhole, MapPin, Navigation, Search, ShieldCheck,
  Star, Timer, Truck, Wallet,
} from 'lucide-react'
import heroBackground from '../assets/Images/background_header_image.png'
import rescueVehicle from '../assets/Images/background_image_upper.png'
import ctaMechanic from '../assets/Images/cta_mechanic_reference.jpg'
import advantagesBg from '../assets/Images/advantages_bg.jpg'
import './ReferenceHomePage.css'

const issueOptions = [
  { id: 'breakdown', label: 'הרכב לא מניע', icon: AlertTriangle },
  { id: 'tire', label: 'תקר', icon: Car },
  { id: 'accident', label: 'תאונה', icon: Truck },
  { id: 'other', label: 'אחר', icon: Navigation },
]

function BookingWidget({ onStart }) {
  const [pickupAddress, setPickupAddress] = useState('')
  const [dropoffAddress, setDropoffAddress] = useState('')
  const [issue, setIssue] = useState('breakdown')
  const [locating, setLocating] = useState(false)

  const locate = () => {
    setLocating(true)
    if (!navigator.geolocation) {
      setPickupAddress('המיקום הנוכחי שלי')
      setLocating(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPickupAddress('המיקום הנוכחי שלי')
        setLocating(false)
        onStart({ pickupAddress: 'המיקום הנוכחי שלי', pickupLat: coords.latitude, pickupLng: coords.longitude, dropoffAddress, issue })
      },
      () => {
        setPickupAddress('המיקום הנוכחי שלי')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 7000 },
    )
  }

  return (
    <form className="ref-booking" onSubmit={(event) => { event.preventDefault(); onStart({ pickupAddress, dropoffAddress, issue }) }}>
      <div className="ref-booking-title">
        <span><MapPin /></span>
        <strong>הזמן גרר עכשיו!</strong>
      </div>

      <label>מיקום נוכחי</label>
      <div className="ref-input">
        <LocateFixed />
        <input value={pickupAddress} onChange={(event) => setPickupAddress(event.target.value)} placeholder="הזן מיקום אוטומטי" required />
        <button type="button" onClick={locate}>{locating ? '...' : 'GPS'}</button>
      </div>

      <label>יעד <small>(אופציונלי)</small></label>
      <div className="ref-input">
        <Navigation />
        <input value={dropoffAddress} onChange={(event) => setDropoffAddress(event.target.value)} placeholder="הכנס כתובת יעד..." />
      </div>

      <label>סוג תקלה</label>
      <div className="ref-issue-list">
        {issueOptions.map(({ id, label, icon: Icon }) => (
          <button className={issue === id ? 'active' : ''} type="button" onClick={() => setIssue(id)} key={id}>
            <Icon /><span>{label}</span>{issue === id && <Check />}
          </button>
        ))}
      </div>

      <button className="ref-search-button" type="submit"><Search /> חפש גרריסטים זמינים <ArrowLeft /></button>
      <span className="ref-safe"><LockKeyhole /> ללא התחייבות · מחיר שקוף · שירות 24/7</span>
    </form>
  )
}

const steps = [
  { number: '1', icon: MapPin, title: 'מלא פרטים', text: 'מלא מיקום וסוג הבעיה – זה לוקח פחות מדקה' },
  { number: '2', icon: Truck, title: 'בחר גרריסט', text: 'בחר מרשימת גרריסטים זמינים עם דירוגים ומחירים שקופים' },
  { number: '3', icon: CheckCircle2, title: 'קבל שירות', text: 'הגרריסט מגיע אליך ואתה עוקב אחריו בזמן אמת' },
]

const advantages = [
  {
    icon: Timer,
    title: "הגעה תוך 15 דק'",
    text: 'פריסה ארצית מאפשרת לנו להגיע אליך במהירות שיא – בכל מקום בארץ, בכל שעה',
    note: 'זמן תגובה מובטח',
    noteTone: 'orange',
  },
  {
    icon: Wallet,
    title: 'תשלום מאובטח',
    text: 'תשלום נוח ומאובטח דרך האפליקציה, שקיפות מלאה במחיר – ללא הפתעות',
    note: null,
  },
  {
    icon: MapPin,
    title: 'מעקב בזמן אמת',
    text: 'ראה את הגרר מתקרב אליך על המפה בזמן אמת – דע בדיוק מתי הוא מגיע',
    note: 'עדכונים חיים',
    noteTone: 'navy',
  },
]

const reviews = [
  { name: 'יוסי לוי', city: 'תל אביב', initial: 'י', text: 'נתקעתי בכביש 1 בלילה והייתי בפאניקה. תוך דקות בדקתי גרריסט כבר היה אצלי. שירות מדהים, מקצועי ואדיב. ממליץ בחום!' },
  { name: 'מיכל כהן', city: 'חיפה', initial: 'מ', text: 'האוטו נתקע מחוץ לעיר. TOW ME שלחו גרריסט תוך 10 דקות, המחיר היה שקוף מראש ולא היו הפתעות. בדיוק מה שצריך ברגע כזה.', featured: true },
  { name: 'דני אברהם', city: 'ירושלים', initial: 'ד', text: 'השתמשתי ב-TOW ME פעמיים השנה. פעם עם תקר ופעם עם תקלה במנוע – שירות מעולה, גרריסטים מקצועיים וזמינים.' },
]

function SectionTitle({ badge, title, subtitle, tone = '' }) {
  return (
    <header className={`ref-section-title ${tone}`}>
      <span>{badge}</span>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </header>
  )
}

export default function ReferenceHomePage({ onStart }) {
  return (
    <main className="reference-home">
      <section className="ref-hero ref-shell" aria-labelledby="ref-hero-title">
        <div className="ref-hero-bg" style={{ backgroundImage: `url(${heroBackground})` }} />
        <div className="ref-hero-overlay" />
        <div className="ref-hero-grid">
          <BookingWidget onStart={onStart} />
          <div className="ref-hero-copy">
            <h1 id="ref-hero-title">תקועים?<br /><strong>אנחנו בדרך!</strong></h1>
            <p>שירות גרר מהיר, אמין ומאובטח –<br />מגיעים אליך תוך <b>15 דקות.</b></p>
            <div className="ref-badges">
              <span><Star /> 4.9/5 דירוג</span>
              <span><ShieldCheck /> מבוטח</span>
              <span><Clock3 /> 24/7 זמין</span>
              <span>2,500+ גרירות</span>
            </div>
          </div>
        </div>
        <div className="ref-rescue-crop" aria-hidden="true"><img src={rescueVehicle} alt="" /></div>
      </section>

      <section className="ref-section ref-how" id="services">
        <div className="ref-content-shell">
          <SectionTitle badge="פשוט וקל" title="איך זה עובד?" subtitle="3 צעדים פשוטים" />
          <div className="ref-three-grid ref-steps">
            {steps.map(({ number, icon: Icon, title, text }) => (
              <article key={number}>
                <span className="ref-number">{number}</span>
                <div className="ref-card-icon"><Icon /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ref-section ref-advantages" id="about">
        <div className="ref-adv-photo" style={{ backgroundImage: `url(${advantagesBg})` }} />
        <div className="ref-content-shell">
          <SectionTitle badge="למה אנחנו?" title="היתרונות שלנו" subtitle="מה מייחד את TOW ME" tone="blue" />
          <div className="ref-three-grid ref-adv-grid">
            {advantages.map(({ icon: Icon, title, text, note, noteTone }) => (
              <article key={title}>
                <div className="ref-card-icon"><Icon /></div>
                <h3>{title}</h3>
                <p>{text}</p>
                {note ? (
                  <span className={`ref-card-note ${noteTone || 'orange'}`}>
                    <CheckCircle2 size={15} /> {note}
                  </span>
                ) : (
                  <span className="ref-card-note-placeholder" />
                )}
              </article>
            ))}
          </div>
          <div className="ref-stats">
            <div><strong dir="ltr">2,500+</strong><span>גרירות בחודש</span></div>
            <div><strong dir="ltr">4.9★</strong><span>דירוג ממוצע</span></div>
            <div><strong>15 דק׳</strong><span>זמן הגעה ממוצע</span></div>
            <div><strong dir="ltr">200+</strong><span>גרריסטים מוסמכים</span></div>
          </div>
        </div>
      </section>

      <section className="ref-section ref-reviews" id="reviews">
        <div className="ref-content-shell">
          <SectionTitle badge="ביקורות אמיתיות" title="לקוחות מרוצים" subtitle="מה אומרים עלינו" tone="yellow" />
          <div className="ref-three-grid ref-review-grid">
            {reviews.map((review) => (
              <article className={review.featured ? 'featured' : ''} key={review.name}>
                <div className="ref-stars">★★★★★</div>
                <p>״{review.text}״</p>
                <footer><span>{review.initial}</span><div><strong>{review.name}</strong><small>{review.city}</small></div></footer>
              </article>
            ))}
          </div>

          <div className="ref-cta">
            <div className="ref-cta-copy">
              <h2>תקועים? אנחנו כאן 24/7</h2>
              <p>קבל עזרה מיידית – גרריסטים מוסמכים ומבוטחים בכל רחבי הארץ</p>
              <button type="button" onClick={() => onStart({})}>הזמן גרר עכשיו <ArrowLeft /></button>
              <small>ללא הגבלת כרטיס מראש · שירות מיידי</small>
            </div>
            <div className="ref-cta-photo" style={{ backgroundImage: `url(${ctaMechanic})` }} />
          </div>
        </div>
      </section>
    </main>
  )
}
