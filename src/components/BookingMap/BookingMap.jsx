import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./BookingMap.css";

const ISRAEL_CENTER = [31.7683, 35.2137];

function MapViewport({ pickup, dropoff }) {
  const map = useMap();

  useEffect(() => {
    const points = [pickup, dropoff].filter(Boolean);
    if (points.length === 2) {
      map.fitBounds(points, { padding: [42, 42], maxZoom: 15 });
    } else if (points.length === 1) {
      map.setView(points[0], 15);
    }
  }, [dropoff, map, pickup]);

  return null;
}

function ClickSelector({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

export default function BookingMap({ booking, onSelect, readOnly = false, driver = null }) {
  const [selection, setSelection] = useState("pickup");
  const [busy, setBusy] = useState(false);
  const pickup = useMemo(
    () =>
      Number.isFinite(booking.pickupLat) && Number.isFinite(booking.pickupLng)
        ? [booking.pickupLat, booking.pickupLng]
        : null,
    [booking.pickupLat, booking.pickupLng],
  );
  const dropoff = useMemo(
    () =>
      Number.isFinite(booking.dropoffLat) && Number.isFinite(booking.dropoffLng)
        ? [booking.dropoffLat, booking.dropoffLng]
        : null,
    [booking.dropoffLat, booking.dropoffLng],
  );
  const center = pickup || dropoff || ISRAEL_CENTER;

  const handleSelect = async (lat, lng) => {
    if (busy || readOnly || !onSelect) return;
    setBusy(true);
    try {
      await onSelect(selection, lat, lng);
      if (selection === "pickup") setSelection("dropoff");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="booking-map" dir="ltr">
      {!readOnly && <div className="booking-map__toolbar" dir="rtl">
        <button
          type="button"
          className={selection === "pickup" ? "active" : ""}
          onClick={() => setSelection("pickup")}
        >
          נקודת איסוף
        </button>
        <button
          type="button"
          className={selection === "dropoff" ? "active" : ""}
          onClick={() => setSelection("dropoff")}
        >
          יעד
        </button>
      </div>}
      <MapContainer center={center} zoom={pickup || dropoff ? 15 : 8} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!readOnly && <ClickSelector onSelect={handleSelect} />}
        <MapViewport pickup={pickup} dropoff={dropoff} />
        {pickup && (
          <CircleMarker
            center={pickup}
            radius={10}
            pathOptions={{ color: "#fff", fillColor: "#ff642f", fillOpacity: 1, weight: 3 }}
          >
            <Popup direction="rtl">{booking.pickupAddress || "נקודת איסוף"}</Popup>
          </CircleMarker>
        )}
        {dropoff && (
          <CircleMarker
            center={dropoff}
            radius={10}
            pathOptions={{ color: "#fff", fillColor: "#1699b9", fillOpacity: 1, weight: 3 }}
          >
            <Popup direction="rtl">{booking.dropoffAddress || "יעד"}</Popup>
          </CircleMarker>
        )}
        {pickup && dropoff && (
          <Polyline positions={[pickup, dropoff]} pathOptions={{ color: "#ff642f", weight: 4, dashArray: "8 8" }} />
        )}
        {Number.isFinite(driver?.lat) && Number.isFinite(driver?.lng) && (
          <CircleMarker
            center={[driver.lat, driver.lng]}
            radius={11}
            pathOptions={{ color: "#fff", fillColor: "#28c76f", fillOpacity: 1, weight: 3 }}
          >
            <Popup direction="rtl">מיקום הגרריסט</Popup>
          </CircleMarker>
        )}
      </MapContainer>
      {!readOnly && <div className="booking-map__hint" dir="rtl">
        {busy ? "מאתר כתובת..." : `לחץ על המפה לבחירת ${selection === "pickup" ? "נקודת איסוף" : "יעד"}`}
      </div>}
    </div>
  );
}
