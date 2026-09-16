import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  Car,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Headphones,
  Heart,
  KeyRound,
  LocateFixed,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Navigation,
  Phone,
  Plus,
  ReceiptText,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TimerReset,
  Truck,
  UserRound,
  WalletCards,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import canvasConfetti from "canvas-confetti";
import heroBackground from "./assets/Images/background_header_image.png";
import rescueVehicle from "./assets/Images/background_image_upper.png";
import towMeLogo from "../../tow_me-flutter/assets/images/tow_me_logo.png";
import mapTruck from "../../tow_me-flutter/assets/images/map_truck.png";
import towingPhoto from "../../tow_me-flutter/assets/images/towing_vehicle_photo.png";
import { api, clearSession, getStoredSession } from "./api";
import ReferenceHomePage from "./components/ReferenceHomePage";
import "./App.css";

const STEPS = [
  { id: 1, label: "מיקום ופרטים" },
  { id: 2, label: "פרטי רכב" },
  { id: 3, label: "בחר גרריסט" },
  { id: 4, label: "תשלום" },
];
const ISSUES = [
  { id: "breakdown", label: "תקלה במנוע", hint: "הרכב לא מתניע", icon: Zap },
  {
    id: "tire",
    label: "תקר בצמיג",
    hint: "גלגל מפונצ׳ר",
    icon: CircleDollarSign,
  },
  { id: "accident", label: "תאונה", hint: "הרכב ניזוק", icon: Car },
  {
    id: "battery",
    label: "בעיית חשמל / סוללה",
    hint: "סוללה מרוקנת",
    icon: BatteryCharging,
  },
];
const VEHICLE_TYPES = [
  { id: "car", label: "רכב פרטי", hint: "עד 5 נוסעים", icon: Car },
  {
    id: "motorcycle",
    label: "אופנוע",
    hint: "אופנוע / קטנוע",
    icon: Navigation,
  },
  { id: "truck", label: "משאית / רכב כבד", hint: "2.6–60 טון", icon: Truck },
  {
    id: "work_equipment",
    label: "כלי עבודה",
    hint: "2.6–60 טון",
    icon: Wrench,
  },
];
const WEIGHT_BANDS = ["2.6-5", "5.1-8", "8.1-12", "12.1-20", "20.1-60"];
const DEFAULT_BOOKING = {
  pickupAddress: "",
  dropoffAddress: "",
  pickupLat: 32.0853,
  pickupLng: 34.7818,
  dropoffLat: 32.0621,
  dropoffLng: 34.7724,
  issue: "breakdown",
  issueDetails: "",
  vehicleType: "car",
  weightBand: "",
  licensePlate: "",
  make: "",
  makeId: "",
  model: "",
  year: "",
  color: "",
  vehicleState: "not_drivable",
  vehicleNotes: "",
  paymentMethod: "card",
  contactName: "",
  contactPhone: "",
  smsUpdates: true,
};
const FALLBACK_MAKES = [
  { id: 1, name: "Toyota" },
  { id: 2, name: "Hyundai" },
  { id: 3, name: "Kia" },
  { id: 4, name: "Mazda" },
  { id: 5, name: "Skoda" },
];

function Brand({ light = false }) {
  return (
    <button
      className={`brand ${light ? "brand--light" : ""}`}
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <img src={towMeLogo} alt="TOW ME" />
    </button>
  );
}

function Header({ onBook, onLogin, session, onLogout, compact = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className={`site-header ${compact ? "site-header--compact" : ""}`}>
      <div className="orange-rule" />
      <div className="shell header-inner">
        <Brand />
        <nav
          className={`main-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="ניווט ראשי"
        >
          <a href="#services" onClick={() => setMenuOpen(false)}>
            שירותים
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            אודות
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            יצירת קשר
          </a>
          {session?.token ? (
            <button
              className="nav-text-button"
              type="button"
              onClick={onLogout}
            >
              יציאה מהחשבון
            </button>
          ) : (
            <button className="nav-text-button" type="button" onClick={onLogin}>
              כניסה לחשבון
            </button>
          )}
        </nav>
        <button className="header-cta" type="button" onClick={onBook}>
          הזמן גרר עכשיו <ArrowLeft size={17} />
        </button>
        <button
          className="menu-button"
          type="button"
          aria-label="פתיחת תפריט"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Brand light />
          <p>שירות גרר מקצועי וזמין עבורכם 24 שעות ביממה, 7 ימים בשבוע.</p>
          <div className="social-row">
            <span>f</span>
            <span>ig</span>
            <span>♪</span>
          </div>
        </div>
        <div>
          <h3>שירותים</h3>
          <a href="#services">גרירת רכב</a>
          <a href="#services">עזרה בדרך</a>
          <a href="#services">פתיחת רכב נעול</a>
          <a href="#services">הנעת רכב</a>
        </div>
        <div>
          <h3>חברה</h3>
          <a href="#about">אודות</a>
          <a href="#reviews">הצטרפות כגרריסט</a>
          <a href="#reviews">בלוג</a>
          <a href="#terms">תנאי שימוש</a>
        </div>
        <div>
          <h3>יצירת קשר</h3>
          <a href="tel:180086963">
            <Phone size={14} /> 1-800-TOW-ME
          </a>
          <a href="mailto:info@towme.co.il">
            <Mail size={14} /> info@towme.co.il
          </a>
          <span>
            <Clock3 size={14} /> 24/7 זמין
          </span>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>כל הזכויות שמורות © {new Date().getFullYear()} TOW ME.</span>
        <div>
          <a href="#privacy">מדיניות פרטיות</a>
          <a href="#terms">תנאי שימוש</a>
          <a href="#accessibility">נגישות</a>
        </div>
      </div>
    </footer>
  );
}

function HeroBookingCard({ onStart }) {
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [issue, setIssue] = useState("breakdown");
  const [locating, setLocating] = useState(false);
  const locate = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      setPickupAddress("המיקום הנוכחי שלי");
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPickupAddress("המיקום הנוכחי שלי");
        setLocating(false);
        onStart({
          pickupAddress: "המיקום הנוכחי שלי",
          pickupLat: coords.latitude,
          pickupLng: coords.longitude,
          dropoffAddress,
          issue,
        });
      },
      () => {
        setPickupAddress("המיקום הנוכחי שלי");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 7000 },
    );
  };
  return (
    <form
      className="hero-booking-card"
      onSubmit={(event) => {
        event.preventDefault();
        onStart({ pickupAddress, dropoffAddress, issue });
      }}
    >
      <div className="card-heading">
        <span>
          <MapPin />
        </span>
        <div>
          <strong>הזמן גרר עכשיו</strong>
          <small>מיקום נוכחי</small>
        </div>
      </div>
      <label>מיקום נוכחי</label>
      <div className="field-shell">
        <LocateFixed size={17} />
        <input
          value={pickupAddress}
          onChange={(event) => setPickupAddress(event.target.value)}
          placeholder="הכנס כתובת או זהה מיקום"
          required
        />
        <button type="button" className="gps-button" onClick={locate}>
          {locating ? "..." : "GPS"}
        </button>
      </div>
      <label>
        יעד <span>(אופציונלי)</span>
      </label>
      <div className="field-shell">
        <Navigation size={17} />
        <input
          value={dropoffAddress}
          onChange={(event) => setDropoffAddress(event.target.value)}
          placeholder="הכנס כתובת יעד..."
        />
      </div>
      <label>סוג תקלה</label>
      <div className="field-shell field-shell--select">
        <AlertTriangle size={17} />
        <select
          value={issue}
          onChange={(event) => setIssue(event.target.value)}
        >
          {ISSUES.map((item) => (
            <option value={item.id} key={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} />
      </div>
      <div className="quick-issues">
        {ISSUES.slice(0, 3).map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            className={issue === id ? "active" : ""}
            onClick={() => setIssue(id)}
            key={id}
          >
            <Icon /> {label}
          </button>
        ))}
      </div>
      <button className="primary-button primary-button--orange" type="submit">
        <Search size={18} /> חפש גרריסטים זמינים <ArrowLeft size={18} />
      </button>
      <small className="secure-note">
        <LockKeyhole size={13} /> ללא התחייבות · מחיר שקוף · שירות 24/7
      </small>
    </form>
  );
}

function _HomePage({ onStart }) {
  const steps = [
    {
      number: "1",
      icon: MapPin,
      title: "מלא פרטים",
      text: "מלא מיקום וסוג הבעיה – זה לוקח פחות מדקה.",
    },
    {
      number: "2",
      icon: Truck,
      title: "בחר גרריסט",
      text: "בחר מתוך גרריסטים זמינים עם דירוגים ומחירים שקופים.",
    },
    {
      number: "3",
      icon: CheckCircle2,
      title: "קבל שירות",
      text: "הגרריסט מגיע אליך בזמן שנקבע ומלווה אותך עד הפתרון.",
    },
  ];
  const advantages = [
    {
      icon: Clock3,
      title: "הגעה תוך 15 דק'",
      text: "פריסה ארצית מאפשרת לנו להגיע אליך במהירות שיא – בכל מקום בארץ, בכל שעה",
      note: "זמן תגובה מובטח",
    },
    {
      icon: WalletCards,
      title: "תשלום מאובטח",
      text: "תשלום נוח ומאובטח דרך האפליקציה, שקיפות מלאה במחיר – ללא הפתעות",
      note: "",
    },
    {
      icon: MapPin,
      title: "מעקב בזמן אמת",
      text: "ראה את הגרר מתקרב אליך על המפה בזמן אמת – דע בדיוק מתי הוא מגיע",
      note: "עדכונים חיים",
    },
  ];
  const reviews = [
    {
      name: "יוסי לוי",
      city: "תל אביב",
      text: "נתקעתי בכביש 1 בלילה והגרר הגיע במהירות. שירות אדיב, מקצועי ומחיר הוגן.",
    },
    {
      name: "מיכל כהן",
      city: "חיפה",
      text: "הזמנתי דרך האתר, ראיתי את המחיר מראש וקיבלתי עדכון בכל שלב. פשוט מצוין.",
      featured: true,
    },
    {
      name: "דני אברהם",
      city: "ירושלים",
      text: "מערכת נוחה מאוד ושירות מהיר. הנהג היה מקצועי ושמר על הרכב לאורך כל הדרך.",
    },
  ];
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div
          className="hero-background"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="hero-shade" />
        <div className="shell hero-layout">
          <div className="hero-copy">
            <span className="eyebrow eyebrow--dark">
              <Sparkles size={14} /> זמינים בכל הארץ
            </span>
            <h1 id="hero-title">
              תקועים?
              <br />
              <em>אנחנו בדרך!</em>
            </h1>
            <p>
              שירות גרר מהיר, אמין ומאובטח — מגיעים אליך תוך{" "}
              <strong>15 דקות.</strong>
            </p>
            <div className="hero-badges">
              <span>
                <Star /> 4.9/5 דירוג
              </span>
              <span>
                <ShieldCheck /> מבוטח
              </span>
              <span>
                <Clock3 /> 24/7 זמין
              </span>
              <span>2,500+ גרירות</span>
            </div>
          </div>
          <HeroBookingCard onStart={onStart} />
        </div>
        <img
          className="hero-rescue-image"
          src={rescueVehicle}
          alt="רכב תקוע מקבל שירות גרירה"
        />
      </section>
      <section className="section section--steps" id="services">
        <div className="shell">
          <header className="section-heading">
            <span className="eyebrow">פשוט וקל</span>
            <h2>איך זה עובד?</h2>
            <p>3 צעדים פשוטים</p>
          </header>
          <div className="steps-grid">
            {steps.map(({ number, icon: Icon, title, text }) => (
              <article className="step-card" key={number}>
                <span className="step-number">{number}</span>
                <div className="step-icon">
                  <Icon />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--advantages" id="about">
        <div className="shell">
          <header className="section-heading">
            <span className="eyebrow eyebrow--blue">למה אנחנו?</span>
            <h2>היתרונות שלנו</h2>
            <p>מה מייחד את TOW ME</p>
          </header>
          <div className="advantages-grid">
            {advantages.map(({ icon: Icon, title, text, note }) => (
              <article className="advantage-card" key={title}>
                <div className="advantage-icon">
                  <Icon />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                {note && (
                  <span>
                    <CheckCircle2 size={14} /> {note}
                  </span>
                )}
              </article>
            ))}
          </div>
          <div className="stats-ribbon">
            <div>
              <strong>2,500+</strong>
              <span>גרירות בחודש</span>
            </div>
            <div>
              <strong>4.9 ★</strong>
              <span>דירוג ממוצע</span>
            </div>
            <div>
              <strong>15 דק׳</strong>
              <span>זמן הגעה ממוצע</span>
            </div>
            <div>
              <strong>200+</strong>
              <span>גרריסטים מוסמכים</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--reviews" id="reviews">
        <div className="shell">
          <header className="section-heading">
            <span className="eyebrow eyebrow--yellow">ביקורות אמיתיות</span>
            <h2>לקוחות מרוצים</h2>
            <p>מה אומרים עלינו</p>
          </header>
          <div className="reviews-grid">
            {reviews.map((review) => (
              <article
                className={`review-card ${review.featured ? "featured" : ""}`}
                key={review.name}
              >
                <div className="stars">★★★★★</div>
                <p>״{review.text}״</p>
                <footer>
                  <span className="avatar">{review.name[0]}</span>
                  <div>
                    <strong>{review.name}</strong>
                    <small>{review.city}</small>
                  </div>
                </footer>
              </article>
            ))}
          </div>
          <div className="home-cta">
            <div>
              <span className="eyebrow eyebrow--dark">שירות מיידי</span>
              <h2>תקועים? אנחנו כאן 24/7</h2>
              <p>קבל עזרה מיידית מגרריסטים מוסמכים ומבוטחים בכל רחבי הארץ.</p>
              <button className="cta-light-button" onClick={() => onStart({})}>
                הזמן גרר עכשיו <ArrowLeft size={17} />
              </button>
            </div>
            <img src={towingPhoto} alt="רכב על משאית גרר" />
          </div>
        </div>
      </section>
    </main>
  );
}

function ProgressBar({ activeStep }) {
  return (
    <div className="progress-shell">
      <div className="shell progress-row">
        {STEPS.map((step) => {
          const done = step.id < activeStep;
          const active = step.id === activeStep;
          return (
            <div
              className={`progress-step ${done ? "done" : ""} ${active ? "active" : ""}`}
              key={step.id}
            >
              <span>{done ? <Check size={18} /> : step.id}</span>
              <small>{step.label}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function TrustStrip() {
  return (
    <div className="trust-strip">
      <span>
        <ShieldCheck /> מבוטח
      </span>
      <span>
        <LockKeyhole /> מאובטח
      </span>
      <span>
        <Star /> 4.9 דירוג
      </span>
      <span>
        <Headphones /> 24/7
      </span>
    </div>
  );
}

function EstimateCard({ booking, activeStep, estimate }) {
  const issue = ISSUES.find((item) => item.id === booking.issue);
  return (
    <aside className="booking-aside">
      {activeStep === 1 && (
        <div className="mini-map mini-map--pin">
          <span className="availability-dot">● 5 גרריסטים זמינים</span>
          <div className="map-grid" />
          <div className="pulse-pin">
            <MapPin />
          </div>
          <strong>{booking.pickupAddress || "המיקום שלך יוצג כאן"}</strong>
        </div>
      )}
      <div className="summary-card">
        <div className="aside-title">
          <ReceiptText />
          <h3>{activeStep === 1 ? "הערכה מקדימה" : "סיכום הזמנה"}</h3>
        </div>
        {booking.pickupAddress && (
          <div className="summary-row">
            <small>מיקום</small>
            <strong>{booking.pickupAddress}</strong>
          </div>
        )}
        <div className="summary-row">
          <small>סוג בעיה</small>
          <strong>{issue?.label || "תקלה במנוע"}</strong>
        </div>
        {booking.vehicleType && activeStep > 1 && (
          <div className="summary-row">
            <small>רכב</small>
            <strong>
              {
                VEHICLE_TYPES.find((item) => item.id === booking.vehicleType)
                  ?.label
              }
            </strong>
          </div>
        )}
        <div className="summary-row summary-row--split">
          <span>
            <small>זמן הגעה משוער</small>
            <strong>
              {estimate.durationMinutes || 15}–
              {(estimate.durationMinutes || 15) + 4} דקות
            </strong>
          </span>
          <em>מהיר</em>
        </div>
        <div className="summary-row">
          <small>מחיר משוער</small>
          <strong className="orange-text">₪{estimate.total || 0}</strong>
        </div>
        <div className="summary-progress">
          <span>
            <small>התקדמות ההזמנה</small>
            <b>שלב {activeStep} מתוך 4</b>
          </span>
          <div>
            <i style={{ width: `${activeStep * 25}%` }} />
          </div>
        </div>
      </div>
      {activeStep === 2 && (
        <div className="tip-card">
          <Sparkles />
          <h3>טיפ שימושי</h3>
          <p>מספר הרישוי מסייע לגרריסט לזהות את הרכב ולהגיע עם הציוד המתאים.</p>
        </div>
      )}
      <TrustStrip />
      <img className="aside-rescue" src={rescueVehicle} alt="סיוע לרכב תקוע" />
    </aside>
  );
}

function LocationStep({ booking, setBooking, onNext, locating, onLocate }) {
  return (
    <form className="booking-card" onSubmit={onNext}>
      <header className="booking-card-title">
        <span>
          <MapPin />
        </span>
        <div>
          <h1>איפה אתה נמצא?</h1>
          <p>מלא את פרטי המיקום כדי שנוכל למצוא גרריסטים זמינים באזור</p>
        </div>
      </header>
      <div className="form-section">
        <h3>
          <KeyRound size={16} /> פרטי מיקום
        </h3>
        <label>מיקום נוכחי *</label>
        <div className="input-control">
          <LocateFixed />
          <input
            value={booking.pickupAddress}
            onChange={(event) =>
              setBooking({ ...booking, pickupAddress: event.target.value })
            }
            placeholder="הכנס כתובת או לחץ לזיהוי אוטומטי"
            required
          />
        </div>
        <button className="location-button" type="button" onClick={onLocate}>
          <MapPin size={17} />{" "}
          {locating ? "מזהה מיקום..." : "זהה מיקום אוטומטית"}
        </button>
        <label>יעד *</label>
        <div className="input-control">
          <Navigation />
          <input
            value={booking.dropoffAddress}
            onChange={(event) =>
              setBooking({ ...booking, dropoffAddress: event.target.value })
            }
            placeholder="לאן לגרור את הרכב?"
            required
          />
        </div>
      </div>
      <div className="form-section">
        <h3>
          <AlertTriangle size={16} /> סוג הבעיה *
        </h3>
        <div className="choice-grid choice-grid--two">
          {ISSUES.map(({ id, label, hint, icon: Icon }) => (
            <button
              className={`choice-card ${booking.issue === id ? "selected" : ""}`}
              type="button"
              onClick={() => setBooking({ ...booking, issue: id })}
              key={id}
            >
              <Icon />
              <span>
                <strong>{label}</strong>
                <small>{hint}</small>
              </span>
              {booking.issue === id && <CheckCircle2 />}
            </button>
          ))}
        </div>
        <label>
          תיאור נוסף <span>(אופציונלי)</span>
        </label>
        <textarea
          value={booking.issueDetails}
          onChange={(event) =>
            setBooking({ ...booking, issueDetails: event.target.value })
          }
          placeholder="תאר את הבעיה בפרטים נוספים..."
          rows="4"
        />
      </div>
      <button className="primary-button" type="submit">
        המשך <ArrowLeft />
      </button>
    </form>
  );
}

function VehicleStep({ booking, setBooking, onBack, onNext }) {
  const [manufacturers, setManufacturers] = useState(FALLBACK_MAKES);
  const [models, setModels] = useState([]);
  const [loadingMakes, setLoadingMakes] = useState(false);
  useEffect(() => {
    let active = true;
    setLoadingMakes(true);
    api
      .getManufacturers()
      .then((items) => {
        if (active && items?.length) setManufacturers(items);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoadingMakes(false);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!booking.makeId) {
      setModels([]);
      return undefined;
    }
    let active = true;
    api
      .getModels(booking.makeId)
      .then((items) => {
        if (active) setModels(items || []);
      })
      .catch(() => {
        if (active) setModels([]);
      });
    return () => {
      active = false;
    };
  }, [booking.makeId]);
  return (
    <form
      className="booking-card"
      onSubmit={(event) => {
        event.preventDefault();
        onNext();
      }}
    >
      <header className="booking-card-title">
        <span>
          <Car />
        </span>
        <div>
          <h1>פרטי הרכב שלך</h1>
          <p>כדי שנוכל לשלוח את הגרריסט המתאים</p>
        </div>
      </header>
      <div className="form-section">
        <h3>
          <Car size={16} /> סוג הרכב *
        </h3>
        <div className="choice-grid choice-grid--three">
          {VEHICLE_TYPES.map(({ id, label, hint, icon: Icon }) => (
            <button
              className={`vehicle-choice ${booking.vehicleType === id ? "selected" : ""}`}
              type="button"
              onClick={() =>
                setBooking({
                  ...booking,
                  vehicleType: id,
                  weightBand: "",
                  make: "",
                  makeId: "",
                  model: "",
                })
              }
              key={id}
            >
              <Icon />
              <strong>{label}</strong>
              <small>{hint}</small>
              {booking.vehicleType === id && <CheckCircle2 />}
            </button>
          ))}
        </div>
      </div>
      <div className="form-section">
        <label>מספר לוחית רישוי *</label>
        <div className="license-input">
          <span>IL</span>
          <input
            value={booking.licensePlate}
            onChange={(event) =>
              setBooking({ ...booking, licensePlate: event.target.value })
            }
            placeholder="00-000-00"
            required
          />
        </div>
        <small className="helper-text">
          הזן את המספר ללא מקפים, למשל: 1234567
        </small>
        {booking.vehicleType === "car" && (
          <>
            <h3 className="subheading">פרטי הרכב</h3>
            <div className="field-grid">
              <label>
                יצרן הרכב
                <select
                  value={booking.makeId}
                  required
                  onChange={(event) => {
                    const selected = manufacturers.find(
                      (item) => String(item.id) === event.target.value,
                    );
                    setBooking({
                      ...booking,
                      makeId: event.target.value,
                      make: selected?.name || "",
                      model: "",
                    });
                  }}
                >
                  <option value="">
                    {loadingMakes ? "טוען יצרנים..." : "בחר יצרן..."}
                  </option>
                  {manufacturers.map((item) => (
                    <option value={item.id} key={`${item.id}-${item.name}`}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                דגם הרכב
                <input
                  value={booking.model}
                  onChange={(event) =>
                    setBooking({ ...booking, model: event.target.value })
                  }
                  list="vehicle-models"
                  placeholder="למשל: קורולה"
                />
                <datalist id="vehicle-models">
                  {models.map((item) => (
                    <option value={item.name} key={`${item.id}-${item.name}`} />
                  ))}
                </datalist>
              </label>
              <label>
                שנת ייצור
                <select
                  value={booking.year}
                  onChange={(event) =>
                    setBooking({ ...booking, year: event.target.value })
                  }
                >
                  <option value="">בחר שנה...</option>
                  {Array.from(
                    { length: 27 },
                    (_, index) => new Date().getFullYear() - index,
                  ).map((year) => (
                    <option key={year}>{year}</option>
                  ))}
                </select>
              </label>
              <label>
                צבע הרכב
                <input
                  value={booking.color}
                  onChange={(event) =>
                    setBooking({ ...booking, color: event.target.value })
                  }
                  placeholder="למשל: לבן, שחור"
                />
              </label>
            </div>
          </>
        )}
        {(booking.vehicleType === "truck" ||
          booking.vehicleType === "work_equipment") && (
          <label>
            טווח משקל הרכב *
            <select
              value={booking.weightBand}
              onChange={(event) =>
                setBooking({ ...booking, weightBand: event.target.value })
              }
              required
            >
              <option value="">בחר טווח משקל...</option>
              {WEIGHT_BANDS.map((band) => (
                <option value={band} key={band}>
                  {band} טון
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="form-section">
        <h3>מצב הרכב *</h3>
        <div className="radio-stack">
          {[
            {
              id: "drivable",
              title: "הרכב נוהג",
              text: "ניתן להזיז את הרכב בעצמו",
              icon: KeyRound,
            },
            {
              id: "not_drivable",
              title: "הרכב לא נוהג",
              text: "צריך גרירה מלאה – הרכב לא זז",
              icon: Wrench,
            },
            {
              id: "locked",
              title: "הרכב נעול / אין גישה",
              text: "אין יכולת להיכנס או להניע",
              icon: LockKeyhole,
            },
          ].map(({ id, title, text, icon: Icon }) => (
            <button
              className={booking.vehicleState === id ? "selected" : ""}
              type="button"
              onClick={() => setBooking({ ...booking, vehicleState: id })}
              key={id}
            >
              <Icon />
              <span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
              <i>{booking.vehicleState === id ? <Check /> : ""}</i>
            </button>
          ))}
        </div>
        <label>
          הערות נוספות <span>(אופציונלי)</span>
        </label>
        <textarea
          value={booking.vehicleNotes}
          onChange={(event) =>
            setBooking({ ...booking, vehicleNotes: event.target.value })
          }
          placeholder="תאר את הבעיה בפירוט, מיקום מדויק וכל מידע שיעזור לגרריסט..."
          maxLength="300"
          rows="4"
        />
        <small className="char-count">
          {booking.vehicleNotes.length} / 300 תווים
        </small>
      </div>
      <div className="form-actions">
        <button className="secondary-button" type="button" onClick={onBack}>
          <ArrowRight /> חזרה
        </button>
        <button className="primary-button" type="submit">
          המשך <ArrowLeft />
        </button>
      </div>
    </form>
  );
}

function FindingStep({ booking, estimate, onBack, onContinue }) {
  const [seconds, setSeconds] = useState(5);
  useEffect(() => {
    const timer = window.setInterval(
      () => setSeconds((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="finding-layout">
      <div className="finding-main">
        <header className="finding-title">
          <h1>{seconds ? "נמצא גרר בקרבת מקום" : "מצאנו גרריסט מתאים!"}</h1>
          <p>
            {seconds
              ? `5 גרריסטים זמינים כרגע ברדיוס ${seconds} ק״מ...`
              : "דוד כהן זמין ויכול להגיע אליך במהירות"}
          </p>
        </header>
        <div className="radar-stage">
          <div className="radar-rings">
            <span />
            <span />
            <span />
            <div className="radar-center">
              <img src={mapTruck} alt="משאית גרר" />
            </div>
            <i className="radar-icon radar-icon--one">
              <MapPin />
            </i>
            <i className="radar-icon radar-icon--two">
              <Truck />
            </i>
            <i className="radar-icon radar-icon--three">
              <Heart />
            </i>
          </div>
        </div>
        <div className="driver-preview">
          <div className="driver-avatar">
            <UserRound />
          </div>
          <div>
            <span className="stars">★ 4.9</span>
            <h3>דוד כהן</h3>
            <p>Ford F-250 · גרר שטוח · נהג מוסמך</p>
          </div>
          <div className="eta-box">
            <strong>8</strong>
            <small>דקות</small>
          </div>
        </div>
        <div className="finding-actions">
          <button className="secondary-button" type="button" onClick={onBack}>
            <ArrowRight /> חזרה
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={onContinue}
            disabled={seconds > 0}
          >
            {seconds > 0 ? `מחפש... ${seconds}` : "המשך לתשלום"} <ArrowLeft />
          </button>
        </div>
      </div>
      <div className="finding-side">
        <div className="mini-map">
          <span className="availability-dot">● 5 זמינים</span>
          <div className="map-grid" />
          <img className="moving-truck" src={mapTruck} alt="גרר על המפה" />
          <span className="you-dot" />
        </div>
        <EstimateCard booking={booking} activeStep={3} estimate={estimate} />
      </div>
    </div>
  );
}

function PaymentStep({
  booking,
  setBooking,
  estimate,
  onBack,
  onConfirm,
  submitting,
  error,
}) {
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  return (
    <div className="payment-layout">
      <aside className="payment-summary">
        <div className="summary-card">
          <div className="aside-title">
            <ReceiptText />
            <h3>סיכום הזמנה סופי</h3>
          </div>
          <span className="approved-dot">● מוכן לאישור</span>
          <div className="summary-row">
            <small>מיקום</small>
            <strong>{booking.pickupAddress}</strong>
          </div>
          <div className="summary-row">
            <small>רכב</small>
            <strong>
              {booking.vehicleType === "car"
                ? `${booking.make} ${booking.model}`
                : `${VEHICLE_TYPES.find((item) => item.id === booking.vehicleType)?.label || ""} ${booking.weightBand ? `(${booking.weightBand} טון)` : ""}`}
            </strong>
          </div>
          <div className="summary-row">
            <small>בעיה</small>
            <strong>
              {ISSUES.find((item) => item.id === booking.issue)?.label}
            </strong>
          </div>
          <div className="summary-row">
            <small>גרריסט</small>
            <strong>דוד כהן · ★ 4.9</strong>
          </div>
          <div className="summary-row">
            <small>זמן הגעה</small>
            <strong>כ־8 דקות</strong>
          </div>
          <div className="price-breakdown">
            <span>
              שירות גרירה <b>₪{estimate.towingFee || 0}</b>
            </span>
            <span>
              מע״מ 18% <b>₪{estimate.vat || 0}</b>
            </span>
            <strong>
              סה״כ לתשלום <em>₪{estimate.total || 0}</em>
            </strong>
          </div>
        </div>
        <div className="security-card">
          <h3>אבטחה ואמינות</h3>
          <span>
            <LockKeyhole /> תשלום מאובטח SSL
          </span>
          <span>
            <ShieldCheck /> הגנת רכישה מלאה
          </span>
          <span>
            <TimerReset /> ביטול חינם תוך 5 דקות
          </span>
        </div>
        <TrustStrip />
        <img className="aside-rescue" src={rescueVehicle} alt="שירות גרירה" />
      </aside>
      <form
        className="payment-form"
        onSubmit={(event) => {
          event.preventDefault();
          onConfirm();
        }}
      >
        <header className="booking-card-title">
          <span>
            <LockKeyhole />
          </span>
          <div>
            <h1>תשלום ואישור הזמנה</h1>
            <p>השלם את התשלום כדי לאשר את הזמנתך</p>
          </div>
        </header>
        <div className="payment-section">
          <h3>
            <CreditCard /> שיטת תשלום
          </h3>
          <div className="payment-methods">
            {[
              { id: "card", label: "כרטיס אשראי", icon: CreditCard },
              { id: "wallet", label: "Apple / Google Pay", icon: WalletCards },
              { id: "cash", label: "מזומן לנהג", icon: CircleDollarSign },
            ].map(({ id, label, icon: Icon }) => (
              <button
                className={booking.paymentMethod === id ? "selected" : ""}
                type="button"
                onClick={() => setBooking({ ...booking, paymentMethod: id })}
                key={id}
              >
                <Icon />
                <strong>{label}</strong>
                {booking.paymentMethod === id && <CheckCircle2 />}
              </button>
            ))}
          </div>
          {booking.paymentMethod === "card" && (
            <>
              <div className="credit-card-preview">
                <span>TOW ME</span>
                <CreditCard />
                <b>•••• •••• •••• {card.number.slice(-4) || "0000"}</b>
                <small>
                  {card.name || "שם בעל הכרטיס"} · {card.expiry || "MM/YY"}
                </small>
              </div>
              <label>
                מספר כרטיס
                <input
                  inputMode="numeric"
                  value={card.number}
                  onChange={(event) =>
                    setCard({
                      ...card,
                      number: event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 16),
                    })
                  }
                  placeholder="0000 0000 0000 0000"
                  required
                />
              </label>
              <div className="field-grid">
                <label>
                  תוקף
                  <input
                    value={card.expiry}
                    onChange={(event) =>
                      setCard({
                        ...card,
                        expiry: event.target.value.slice(0, 5),
                      })
                    }
                    placeholder="MM / YY"
                    required
                  />
                </label>
                <label>
                  CVV
                  <input
                    inputMode="numeric"
                    value={card.cvv}
                    onChange={(event) =>
                      setCard({
                        ...card,
                        cvv: event.target.value.replace(/\D/g, "").slice(0, 4),
                      })
                    }
                    placeholder="•••"
                    required
                  />
                </label>
              </div>
              <label>
                שם בעל הכרטיס
                <input
                  value={card.name}
                  onChange={(event) =>
                    setCard({ ...card, name: event.target.value })
                  }
                  placeholder="שם מלא כפי שמופיע על הכרטיס"
                  required
                />
              </label>
            </>
          )}
        </div>
        <div className="payment-section">
          <h3>
            <Phone /> פרטי יצירת קשר עם הנהג
          </h3>
          <label>
            שם המזמין
            <input
              value={booking.contactName}
              onChange={(event) =>
                setBooking({ ...booking, contactName: event.target.value })
              }
              placeholder="שם מלא"
              required
            />
          </label>
          <label>
            מספר טלפון
            <input
              value={booking.contactPhone}
              onChange={(event) =>
                setBooking({ ...booking, contactPhone: event.target.value })
              }
              placeholder="05X-XXX-XXXX"
              required
            />
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={booking.smsUpdates}
              onChange={(event) =>
                setBooking({ ...booking, smsUpdates: event.target.checked })
              }
            />
            <span>שלח לי עדכונים ב-SMS על מיקום הגרריסט</span>
          </label>
        </div>
        <label className="terms-row">
          <input type="checkbox" required /> אני מסכים/ה לתנאי השירות ולמדיניות
          הפרטיות של TOW ME
        </label>
        {error && (
          <div className="form-error">
            <AlertTriangle /> {error}
          </div>
        )}
        <div className="form-actions">
          <button className="secondary-button" type="button" onClick={onBack}>
            <ArrowRight /> חזרה
          </button>
          <button
            className="primary-button primary-button--pay"
            type="submit"
            disabled={submitting}
          >
            <Check />{" "}
            {submitting
              ? "מאשר הזמנה..."
              : `אשר הזמנה — ₪${estimate.total || 0}`}{" "}
            <ArrowLeft />
          </button>
        </div>
        <small className="payment-privacy">
          <LockKeyhole /> פרטי הכרטיס אינם נשמרים או נשלחים לשרת TOW ME
        </small>
      </form>
    </div>
  );
}

function TrackingScreen({
  trip,
  booking,
  estimate,
  tracking,
  onCancel,
  cancelling,
}) {
  const driver = tracking?.driver;
  const eta = tracking?.etaMinutes || 8;
  const orderNumber = trip?.tripNumber || "TM-2024-7841";
  return (
    <main className="tracking-page">
      <section className="success-banner">
        <div className="shell">
          <span className="success-icon">
            <Check />
          </span>
          <div>
            <h1>ההזמנה אושרה!</h1>
            <p>
              מספר הזמנה: <strong>#{orderNumber}</strong> · שולם בהצלחה{" "}
              <strong>₪{trip?.price || estimate.total || 0}</strong>
            </p>
          </div>
          <div className="success-pills">
            <span>
              <CheckCircle2 /> אושר
            </span>
            <span>
              <Truck /> בדרך אליך
            </span>
            <span>
              <Clock3 /> הגעה ב־{eta} דק׳
            </span>
          </div>
        </div>
      </section>
      <div className="shell tracking-layout">
        <aside>
          <div className="summary-card trip-details">
            <div className="aside-title">
              <ReceiptText />
              <h3>פרטי ההזמנה</h3>
            </div>
            <div className="summary-row">
              <small>מספר הזמנה</small>
              <strong>#{orderNumber}</strong>
            </div>
            <div className="summary-row">
              <small>כתובת</small>
              <strong>{booking.pickupAddress}</strong>
            </div>
            <div className="summary-row">
              <small>רכב</small>
              <strong>
                {booking.vehicleType === "car"
                  ? `${booking.make} ${booking.model}`
                  : `${VEHICLE_TYPES.find((item) => item.id === booking.vehicleType)?.label || ""} ${booking.weightBand ? `(${booking.weightBand} טון)` : ""}`}{" "}
                {booking.licensePlate}
              </strong>
            </div>
            <div className="summary-row">
              <small>סוג בעיה</small>
              <strong>
                {ISSUES.find((item) => item.id === booking.issue)?.label}
              </strong>
            </div>
            <div className="summary-row">
              <small>גרריסט</small>
              <strong>
                {driver
                  ? `${driver.firstName} ${driver.lastName}`
                  : "ממתין לשיבוץ"}
              </strong>
            </div>
            <div className="summary-row">
              <small>סכום ששולם</small>
              <strong className="green-text">
                ₪{trip?.price || estimate.total || 0}
              </strong>
            </div>
            <button className="receipt-button" type="button">
              <ReceiptText /> הורד קבלה
            </button>
          </div>
          <div className="rating-card is-disabled">
            <h3>דרג את הגרריסט</h3>
            <div>☆ ☆ ☆ ☆ ☆</div>
            <p>הדירוג יהיה זמין לאחר השלמת הגרירה</p>
          </div>
          <div className="help-card">
            <h3>
              <Headphones /> צריך עזרה?
            </h3>
            <button disabled={cancelling} onClick={onCancel}>
              {cancelling ? "מבטל..." : "ביטול הזמנה"} <X />
            </button>
            <a href="tel:180086963">
              שירות לקוחות <Phone />
            </a>
          </div>
          <img className="aside-rescue" src={rescueVehicle} alt="שירות גרירה" />
        </aside>
        <div className="tracking-main">
          <section className="live-card">
            <header>
              <h2>מעקב חי בזמן אמת</h2>
              <span>● עדכני לפני 30 שניות</span>
            </header>
            <div className="live-map">
              <div className="map-grid" />
              <button className="map-control map-control--plus">
                <Plus />
              </button>
              <button className="map-control map-control--minus">
                <Minus />
              </button>
              <span className="route-line" />
              <img src={mapTruck} alt="מיקום הגרר" className="tracking-truck" />
              <span className="destination-pin">
                <MapPin />
              </span>
              <span className="distance-label">1.2 ק״מ</span>
              <div className="map-legend">
                <span>
                  <i className="orange-dot" />{" "}
                  {driver
                    ? `${driver.firstName} ${driver.lastName}`
                    : "הגרריסט"}
                </span>
                <span>
                  <i className="blue-dot" /> המיקום שלך
                </span>
              </div>
            </div>
            <div className="timeline">
              <div className="complete">
                <i>
                  <Check />
                </i>
                <span>
                  <strong>הזמנה אושרה</strong>
                  <small>התשלום עבר בהצלחה</small>
                </span>
              </div>
              <div className={driver ? "complete" : "active"}>
                <i>{driver ? <Check /> : <Truck />}</i>
                <span>
                  <strong>{driver ? "גרריסט שובץ" : "מחפשים גרריסט"}</strong>
                  <small>
                    {driver
                      ? `${driver.firstName} מתחיל לנסוע אליך`
                      : "נעדכן אותך מיד כשנהג יאשר"}
                  </small>
                </span>
              </div>
              <div className={driver ? "active" : ""}>
                <i>
                  <Truck />
                </i>
                <span>
                  <strong>הגרריסט בדרך</strong>
                  <small>
                    {driver ? `במרחק משוער של ${eta} דקות` : "ממתין לשיבוץ"}
                  </small>
                </span>
              </div>
              <div>
                <i>
                  <MapPin />
                </i>
                <span>
                  <strong>הגרריסט הגיע</strong>
                </span>
              </div>
              <div>
                <i>
                  <Check />
                </i>
                <span>
                  <strong>הגרירה הושלמה</strong>
                </span>
              </div>
            </div>
          </section>
          <section className="driver-card">
            <div className="driver-avatar">
              <UserRound />
            </div>
            <div>
              <span className="stars">★ {driver?.rating || "4.9"}</span>
              <h3>
                {driver
                  ? `${driver.firstName} ${driver.lastName}`
                  : "נהג יופיע כאן לאחר השיבוץ"}
              </h3>
              <p>
                {driver?.vehicleType || "גרר שטוח"} ·{" "}
                {driver?.licenseNumber || "נהג מוסמך"}
              </p>
            </div>
            <span className="eta-box">
              <strong>{eta}</strong>
              <small>דקות</small>
            </span>
            <a
              className="call-driver"
              href={
                driver?.phoneNumber
                  ? `tel:${driver.phoneNumber}`
                  : "tel:180086963"
              }
            >
              <Phone /> התקשר לגרריסט
            </a>
            <button className="message-driver">
              <MessageCircle /> שלח הודעה
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}

function AuthDialog({ open, onClose, onSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  if (!open) return null;
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await api.login(phoneNumber, password);
      onSuccess(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="auth-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <button className="dialog-close" onClick={onClose} aria-label="סגירה">
          <X />
        </button>
        <Brand />
        <h2 id="login-title">כניסה לחשבון לקוח</h2>
        <p>התחבר כדי לאשר את ההזמנה ולעקוב אחרי הנהג.</p>
        <form onSubmit={submit}>
          <label>
            מספר טלפון
            <input
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="05X-XXX-XXXX"
              required
              autoFocus
            />
          </label>
          <label>
            סיסמה
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="הסיסמה שלך"
              required
            />
          </label>
          {error && (
            <div className="form-error">
              <AlertTriangle /> {error}
            </div>
          )}
          <button className="primary-button" disabled={loading}>
            {loading ? "מתחבר..." : "כניסה לחשבון"}
          </button>
        </form>
        <small>
          <LockKeyhole /> החיבור מתבצע ישירות לשרת TOW ME המאובטח
        </small>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState(() => {
    const requested = new URLSearchParams(window.location.search).get("screen");
    return [
      "home",
      "location",
      "vehicle",
      "finding",
      "payment",
      "tracking",
    ].includes(requested)
      ? requested
      : "home";
  });
  const [booking, setBooking] = useState(DEFAULT_BOOKING);
  const [estimate, setEstimate] = useState({ total: 0, durationMinutes: 15 });
  const [session, setSession] = useState(() => getStoredSession());
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(false);
  const [trip, setTrip] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const activeStep = useMemo(
    () => ({ location: 1, vehicle: 2, finding: 3, payment: 4 })[screen] || 0,
    [screen],
  );
  useEffect(() => {
    if (screen !== "tracking" || !trip?._id || !session.token) return undefined;
    let active = true;
    const refresh = () =>
      api
        .getDriverLocation(trip._id)
        .then((data) => {
          if (active) setTracking(data);
        })
        .catch(() => {});
    refresh();
    const interval = window.setInterval(refresh, 15000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [screen, trip?._id, session.token]);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (screen === "home") url.searchParams.delete("screen");
    else url.searchParams.set("screen", screen);
    window.history.replaceState({}, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [screen]);
  const startBooking = (initial = {}) => {
    setBooking((current) => ({ ...current, ...initial }));
    setError("");
    setScreen("location");
  };
  const detectLocation = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      setBooking((current) => ({
        ...current,
        pickupAddress: "המיקום הנוכחי שלי",
      }));
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setBooking((current) => ({
          ...current,
          pickupAddress: "המיקום הנוכחי שלי",
          pickupLat: coords.latitude,
          pickupLng: coords.longitude,
        }));
        setLocating(false);
      },
      () => {
        setError("לא הצלחנו לזהות מיקום. אפשר להזין כתובת ידנית.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };
  const tryEstimate = async () => {
    if (!session.token) return;
    try {
      const data = await api.estimateTrip({
        pickupLat: booking.pickupLat,
        pickupLng: booking.pickupLng,
        dropoffLat: booking.dropoffLat,
        dropoffLng: booking.dropoffLng,
        tripType: booking.issue === "accident" ? "roadside" : "towing",
        includeRescue: booking.issue === "accident",
        vehicleType: booking.vehicleType,
        weightBand: booking.weightBand || undefined,
      });
      setEstimate(data);
    } catch {
      /* createTrip remains authoritative */
    }
  };
  const createBooking = async () => {
    if (!getStoredSession().token) {
      setPendingCheckout(true);
      setAuthOpen(true);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const created = await api.createTrip({
        tripType: booking.issue === "accident" ? "roadside" : "towing",
        pickupAddress: booking.pickupAddress,
        pickupLat: booking.pickupLat,
        pickupLng: booking.pickupLng,
        dropoffAddress: booking.dropoffAddress,
        dropoffLat: booking.dropoffLat,
        dropoffLng: booking.dropoffLng,
        vehicleInfo: {
          type: booking.vehicleType,
          weightBand: booking.weightBand || undefined,
          licensePlate: booking.licensePlate,
          make: booking.make,
          model: booking.model,
          year: booking.year ? Number(booking.year) : undefined,
          color: booking.color,
        },
        paymentMethod: booking.paymentMethod,
        notes: [
          booking.issueDetails,
          booking.vehicleNotes,
          `vehicleState:${booking.vehicleState}`,
        ]
          .filter(Boolean)
          .join(" | "),
        estimatedDuration: estimate.durationMinutes,
        includeRescue: booking.issue === "accident",
      });
      setTrip(created);
      setScreen("tracking");
      canvasConfetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.65 },
        colors: ["#ff642f", "#1598b7", "#1a2d50", "#28c76f"],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  const handleAuthSuccess = (user) => {
    setSession(getStoredSession());
    setBooking((current) => ({
      ...current,
      contactName: current.contactName || user.name || "",
      contactPhone: current.contactPhone || user.phoneNumber || "",
    }));
    setAuthOpen(false);
    if (pendingCheckout) {
      setPendingCheckout(false);
      window.setTimeout(createBooking, 0);
    }
  };
  const handleLogout = () => {
    clearSession();
    setSession({ token: "", user: null });
    setScreen("home");
  };
  const cancelTrip = async () => {
    if (!trip?._id || !window.confirm("לבטל את ההזמנה?")) return;
    setCancelling(true);
    try {
      await api.cancelTrip(trip._id);
      setScreen("home");
    } catch (err) {
      window.alert(err.message);
    } finally {
      setCancelling(false);
    }
  };
  return (
    <div className="app">
      <Header
        onBook={() => startBooking({})}
        onLogin={() => setAuthOpen(true)}
        session={session}
        onLogout={handleLogout}
        compact={screen !== "home"}
      />
      {screen === "home" && <ReferenceHomePage onStart={startBooking} />}
      {activeStep > 0 && (
        <>
          <ProgressBar activeStep={activeStep} />
          <main className="booking-page">
            <div className="shell booking-layout">
              {screen === "location" && (
                <>
                  <LocationStep
                    booking={booking}
                    setBooking={setBooking}
                    locating={locating}
                    onLocate={detectLocation}
                    onNext={(event) => {
                      event.preventDefault();
                      setScreen("vehicle");
                    }}
                  />
                  <EstimateCard
                    booking={booking}
                    activeStep={1}
                    estimate={estimate}
                  />
                </>
              )}
              {screen === "vehicle" && (
                <>
                  <VehicleStep
                    booking={booking}
                    setBooking={setBooking}
                    onBack={() => setScreen("location")}
                    onNext={() => {
                      tryEstimate();
                      setScreen("finding");
                    }}
                  />
                  <EstimateCard
                    booking={booking}
                    activeStep={2}
                    estimate={estimate}
                  />
                </>
              )}
              {screen === "finding" && (
                <FindingStep
                  booking={booking}
                  estimate={estimate}
                  onBack={() => setScreen("vehicle")}
                  onContinue={() => setScreen("payment")}
                />
              )}
              {screen === "payment" && (
                <PaymentStep
                  booking={booking}
                  setBooking={setBooking}
                  estimate={estimate}
                  onBack={() => setScreen("finding")}
                  onConfirm={createBooking}
                  submitting={submitting}
                  error={error}
                />
              )}
            </div>
          </main>
        </>
      )}
      {screen === "tracking" && (
        <TrackingScreen
          trip={trip}
          booking={booking}
          estimate={estimate}
          tracking={tracking}
          onCancel={cancelTrip}
          cancelling={cancelling}
        />
      )}
      <Footer />
      <AuthDialog
        open={authOpen}
        onClose={() => {
          setAuthOpen(false);
          setPendingCheckout(false);
        }}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
