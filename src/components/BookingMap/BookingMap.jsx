import { useEffect, useMemo, useRef, useState } from "react";
import {
  ensureGoogleMapsLoaded,
  getGoogleDrivingRoute,
} from "../../services/googleMapsService";
import "./BookingMap.css";

const ISRAEL_CENTER = { lat: 31.7683, lng: 35.2137 };

const PIN_SVG_PATH =
  "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";

export default function BookingMap({
  booking,
  onSelect,
  readOnly = false,
  driver = null,
  height = 300,
  style = {},
}) {
  const mapDivRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const dropoffMarkerRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const infoWindowRef = useRef(null);
  const selectionRef = useRef("pickup");

  const [selection, setSelection] = useState("pickup");
  const [busy, setBusy] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  selectionRef.current = selection;

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

  const pickupRef = useRef(pickup);
  const dropoffRef = useRef(dropoff);
  pickupRef.current = pickup;
  dropoffRef.current = dropoff;

  // 1. Initialize Google Map
  useEffect(() => {
    let active = true;

    ensureGoogleMapsLoaded().then((maps) => {
      if (!active || !maps || !mapDivRef.current) return;

      if (!mapInstanceRef.current) {
        const initPickup = pickupRef.current;
        const initDropoff = dropoffRef.current;
        const initialCenter = initPickup
          ? { lat: initPickup[0], lng: initPickup[1] }
          : initDropoff
            ? { lat: initDropoff[0], lng: initDropoff[1] }
            : ISRAEL_CENTER;

        const map = new maps.Map(mapDivRef.current, {
          center: initialCenter,
          zoom: initPickup || initDropoff ? 14 : 8,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          gestureHandling: "greedy",
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        // Click on map to choose location
        if (!readOnly && onSelect) {
          map.addListener("click", async (e) => {
            if (!e.latLng) return;
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setBusy(true);
            try {
              const currentKind = selectionRef.current;
              await onSelect(currentKind, lat, lng);
              if (currentKind === "pickup") {
                setSelection("dropoff");
              }
            } finally {
              setBusy(false);
            }
          });
        }

        const polyline = new maps.Polyline({
          strokeColor: "#ff642f",
          strokeOpacity: 0.9,
          strokeWeight: 5,
        });

        const infoWindow = new maps.InfoWindow();

        mapInstanceRef.current = map;
        routePolylineRef.current = polyline;
        infoWindowRef.current = infoWindow;
        setMapLoaded(true);
      }
    });

    return () => {
      active = false;
    };
  }, [readOnly, onSelect]);

  // 2. Sync Markers & Route
  useEffect(() => {
    const map = mapInstanceRef.current;
    const maps = window.google?.maps;
    if (!map || !maps) return;

    // Pickup Marker
    if (pickup) {
      const pos = { lat: pickup[0], lng: pickup[1] };
      if (!pickupMarkerRef.current) {
        pickupMarkerRef.current = new maps.Marker({
          position: pos,
          map,
          title: booking.pickupAddress || "נקודת איסוף",
          icon: {
            path: PIN_SVG_PATH,
            scale: 1.4,
            fillColor: "#ff642f",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            anchor: new maps.Point(12, 22),
          },
        });
        pickupMarkerRef.current.addListener("click", () => {
          infoWindowRef.current?.setContent(
            `<div style="font-family: Heebo, sans-serif; font-size: 13px; font-weight: 600; padding: 4px; direction: rtl;">${booking.pickupAddress || "נקודת איסוף"}</div>`,
          );
          infoWindowRef.current?.open(map, pickupMarkerRef.current);
        });
      } else {
        pickupMarkerRef.current.setPosition(pos);
        pickupMarkerRef.current.setTitle(booking.pickupAddress || "נקודת איסוף");
        pickupMarkerRef.current.setMap(map);
      }
    } else if (pickupMarkerRef.current) {
      pickupMarkerRef.current.setMap(null);
      pickupMarkerRef.current = null;
    }

    // Dropoff Marker
    if (dropoff) {
      const pos = { lat: dropoff[0], lng: dropoff[1] };
      if (!dropoffMarkerRef.current) {
        dropoffMarkerRef.current = new maps.Marker({
          position: pos,
          map,
          title: booking.dropoffAddress || "יעד",
          icon: {
            path: PIN_SVG_PATH,
            scale: 1.4,
            fillColor: "#1699b9",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            anchor: new maps.Point(12, 22),
          },
        });
        dropoffMarkerRef.current.addListener("click", () => {
          infoWindowRef.current?.setContent(
            `<div style="font-family: Heebo, sans-serif; font-size: 13px; font-weight: 600; padding: 4px; direction: rtl;">${booking.dropoffAddress || "יעד"}</div>`,
          );
          infoWindowRef.current?.open(map, dropoffMarkerRef.current);
        });
      } else {
        dropoffMarkerRef.current.setPosition(pos);
        dropoffMarkerRef.current.setTitle(booking.dropoffAddress || "יעד");
        dropoffMarkerRef.current.setMap(map);
      }
    } else if (dropoffMarkerRef.current) {
      dropoffMarkerRef.current.setMap(null);
      dropoffMarkerRef.current = null;
    }

    // Driver Marker
    if (Number.isFinite(driver?.lat) && Number.isFinite(driver?.lng)) {
      const pos = { lat: driver.lat, lng: driver.lng };
      if (!driverMarkerRef.current) {
        driverMarkerRef.current = new maps.Marker({
          position: pos,
          map,
          title: "מיקום הגרריסט",
          icon: {
            path: maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: "#28c76f",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
        });
        driverMarkerRef.current.addListener("click", () => {
          infoWindowRef.current?.setContent(
            '<div style="font-family: Heebo, sans-serif; font-size: 13px; font-weight: 600; padding: 4px; direction: rtl;">מיקום הגרריסט</div>',
          );
          infoWindowRef.current?.open(map, driverMarkerRef.current);
        });
      } else {
        driverMarkerRef.current.setPosition(pos);
        driverMarkerRef.current.setMap(map);
      }
    } else if (driverMarkerRef.current) {
      driverMarkerRef.current.setMap(null);
      driverMarkerRef.current = null;
    }

    // Driving Route Polyline & Bounds
    let activeRoute = true;
    if (pickup && dropoff) {
      getGoogleDrivingRoute(
        { lat: pickup[0], lng: pickup[1] },
        { lat: dropoff[0], lng: dropoff[1] },
      ).then((res) => {
        if (!activeRoute) return;
        if (res?.routePoints && res.routePoints.length > 1) {
          const path = res.routePoints.map((p) => ({ lat: p[0], lng: p[1] }));
          routePolylineRef.current?.setPath(path);
          routePolylineRef.current?.setMap(map);

          const bounds = new maps.LatLngBounds();
          path.forEach((p) => bounds.extend(p));
          map.fitBounds(bounds, 36);
        } else {
          // Fallback straight line
          const path = [
            { lat: pickup[0], lng: pickup[1] },
            { lat: dropoff[0], lng: dropoff[1] },
          ];
          routePolylineRef.current?.setPath(path);
          routePolylineRef.current?.setMap(map);

          const bounds = new maps.LatLngBounds();
          path.forEach((p) => bounds.extend(p));
          map.fitBounds(bounds, 36);
        }
      });
    } else {
      routePolylineRef.current?.setMap(null);
      if (pickup) {
        map.setCenter({ lat: pickup[0], lng: pickup[1] });
        map.setZoom(15);
      } else if (dropoff) {
        map.setCenter({ lat: dropoff[0], lng: dropoff[1] });
        map.setZoom(15);
      } else {
        map.setCenter(ISRAEL_CENTER);
        map.setZoom(8);
      }
    }

    return () => {
      activeRoute = false;
    };
  }, [pickup, dropoff, driver, booking.pickupAddress, booking.dropoffAddress, mapLoaded]);

  return (
    <div className="booking-map" dir="ltr">
      {!readOnly && (
        <div className="booking-map__toolbar" dir="rtl">
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
        </div>
      )}

      <div
        ref={mapDivRef}
        className="booking-map__google-map"
        style={{
          height: typeof height === "number" ? `${height}px` : height,
          ...style,
        }}
      />

      {!readOnly && (
        <div className="booking-map__hint" dir="rtl">
          {busy
            ? "מאתר כתובת..."
            : `לחץ על המפה לבחירת ${selection === "pickup" ? "נקודת איסוף" : "יעד"}`}
        </div>
      )}
    </div>
  );
}
