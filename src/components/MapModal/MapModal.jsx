import { useEffect } from "react";
import { Check, MapPin, Navigation, X } from "lucide-react";
import BookingMap from "../BookingMap/BookingMap";
import "./MapModal.css";

export default function MapModal({
  open,
  onClose,
  booking,
  onMapSelect,
  estimate = {},
}) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="dialog-backdrop map-dialog-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="map-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-modal-title"
      >
        <div className="map-dialog__header">
          <div className="map-dialog__title-wrap">
            <span className="map-dialog__icon">
              <MapPin size={22} />
            </span>
            <div>
              <h2 id="map-modal-title">בחירת מיקום במפה</h2>
              <p>לחץ על המפה כדי לסמן את נקודת האיסוף והיעד</p>
            </div>
          </div>
          <button
            type="button"
            className="dialog-close map-dialog__close"
            onClick={onClose}
            aria-label="סגירה"
          >
            <X size={18} />
          </button>
        </div>

        <div className="map-dialog__body">
          <BookingMap
            booking={booking}
            onSelect={onMapSelect}
            height={440}
          />
        </div>

        <div className="map-dialog__footer">
          <div className="map-dialog__locations">
            <div
              className={`map-dialog__loc-badge pickup ${
                booking.pickupAddress ? "filled" : ""
              }`}
            >
              <span className="dot" />
              <div>
                <small>נקודת איסוף:</small>
                <strong>{booking.pickupAddress || "לחץ על המפה לסימון"}</strong>
              </div>
            </div>

            <div
              className={`map-dialog__loc-badge dropoff ${
                booking.dropoffAddress ? "filled" : ""
              }`}
            >
              <span className="dot" />
              <div>
                <small>יעד הגרירה:</small>
                <strong>{booking.dropoffAddress || "לחץ על המפה לסימון"}</strong>
              </div>
            </div>

            {estimate.distanceKm ? (
              <div className="map-dialog__meta">
                <Navigation size={14} />
                <span>
                  {estimate.distanceKm} ק״מ · כ־{estimate.durationMinutes || 15}{" "}
                  דק׳
                </span>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className="primary-button map-dialog__confirm-btn"
            onClick={onClose}
          >
            <Check size={18} /> אישור מיקום וחזרה
          </button>
        </div>
      </div>
    </div>
  );
}
