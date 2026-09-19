const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyBImVqt2QYTLkipGtogurq7_Al9Q_LS4GA";

/**
 * Ensures Google Maps JS API is loaded
 */
export function ensureGoogleMapsLoaded() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.google?.maps?.DirectionsService) {
    return Promise.resolve(window.google.maps);
  }

  return new Promise((resolve) => {
    const existing = document.querySelector("script[src*='maps.googleapis.com/maps/api/js']");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google?.maps || null));
      existing.addEventListener("error", () => resolve(null));
      // In case it already loaded
      if (window.google?.maps) return resolve(window.google.maps);
      setTimeout(() => resolve(window.google?.maps || null), 2500);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places,geometry`;
    script.async = true;
    script.onload = () => resolve(window.google?.maps || null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
    setTimeout(() => resolve(window.google?.maps || null), 3000);
  });
}

/**
 * Calculates straight-line distance fallback
 */
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Calculates road driving route and distance using Google Maps DirectionsService
 * @param {{ lat: number, lng: number } | string} origin
 * @param {{ lat: number, lng: number } | string} destination
 * @returns {Promise<{ distanceKm: number, durationMinutes: number, routePoints: [number, number][], source: string }>}
 */
export async function getGoogleDrivingRoute(origin, destination) {
  if (!origin || !destination) return null;

  const originParam =
    typeof origin === "object" ? { lat: Number(origin.lat), lng: Number(origin.lng) } : origin;
  const destParam =
    typeof destination === "object"
      ? { lat: Number(destination.lat), lng: Number(destination.lng) }
      : destination;

  try {
    const maps = await ensureGoogleMapsLoaded();
    if (maps?.DirectionsService) {
      const directionsService = new maps.DirectionsService();
      const result = await new Promise((resolve, reject) => {
        directionsService.route(
          {
            origin: originParam,
            destination: destParam,
            travelMode: maps.TravelMode.DRIVING,
          },
          (res, status) => {
            if (status === maps.DirectionsStatus.OK && res) {
              resolve(res);
            } else {
              reject(new Error(`Google directions failed: ${status}`));
            }
          },
        );
      });

      const route = result.routes[0];
      const leg = route.legs[0];
      const distanceKm = Math.round((leg.distance.value / 1000) * 10) / 10;
      const durationMinutes = Math.max(1, Math.round(leg.duration.value / 60));
      const routePoints = (route.overview_path || []).map((p) => [p.lat(), p.lng()]);

      return {
        distanceKm,
        durationMinutes,
        routePoints,
        source: "google_directions",
      };
    }
  } catch (err) {
    console.warn("[googleMapsService] DirectionsService error, falling back:", err?.message || err);
  }

  // Fallback if Google Maps JS fails
  if (typeof origin === "object" && typeof destination === "object") {
    const straightKm = haversineKm(origin.lat, origin.lng, destination.lat, destination.lng);
    // Road factor approx 1.25 for urban driving
    const estimatedRoadKm = Math.round(straightKm * 1.25 * 10) / 10;
    return {
      distanceKm: estimatedRoadKm,
      durationMinutes: Math.round((estimatedRoadKm / 40) * 60 + 10),
      routePoints: [
        [origin.lat, origin.lng],
        [destination.lat, destination.lng],
      ],
      source: "fallback",
    };
  }

  return null;
}

/**
 * Searches locations using Google Places AutocompleteService
 * @param {string} query
 * @returns {Promise<Array<{ id: string, place_id: string, label: string, mainText: string, secondaryText: string }>>}
 */
export async function searchGooglePlaces(query) {
  if (!query || query.trim().length < 2) return [];

  try {
    const maps = await ensureGoogleMapsLoaded();
    if (maps?.places?.AutocompleteService) {
      const service = new maps.places.AutocompleteService();
      const predictions = await new Promise((resolve) => {
        service.getPlacePredictions(
          {
            input: query.trim(),
          },
          (results, status) => {
            if (status === maps.places.PlacesServiceStatus.OK && results) {
              resolve(results);
            } else {
              resolve([]);
            }
          },
        );
      });

      if (predictions && predictions.length > 0) {
        return predictions.map((p) => ({
          id: p.place_id,
          place_id: p.place_id,
          label: p.description,
          mainText: p.structured_formatting?.main_text || p.description,
          secondaryText: p.structured_formatting?.secondary_text || "",
        }));
      }
    }
  } catch (err) {
    console.warn("[googleMapsService] AutocompleteService error:", err?.message || err);
  }

  return [];
}

/**
 * Geocodes a placeId or address string to lat/lng coordinates
 * @param {string} placeIdOrAddress
 * @returns {Promise<{ lat: number, lng: number, label: string } | null>}
 */
export async function geocodePlace(placeIdOrAddress) {
  if (!placeIdOrAddress) return null;

  try {
    const maps = await ensureGoogleMapsLoaded();
    if (maps?.Geocoder) {
      const geocoder = new maps.Geocoder();
      const req =
        typeof placeIdOrAddress === "string" && placeIdOrAddress.length > 20
          ? { placeId: placeIdOrAddress }
          : { address: placeIdOrAddress };

      return await new Promise((resolve) => {
        geocoder.geocode(req, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const loc = results[0].geometry.location;
            resolve({
              lat: loc.lat(),
              lng: loc.lng(),
              label: results[0].formatted_address,
            });
          } else {
            resolve(null);
          }
        });
      });
    }
  } catch (err) {
    console.warn("[googleMapsService] Geocoder error:", err?.message || err);
  }

  return null;
}

