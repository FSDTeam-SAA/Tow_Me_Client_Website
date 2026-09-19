import { useEffect, useRef, useState } from "react";
import { LocateFixed, Navigation } from "lucide-react";
import { api } from "../../api";
import {
  geocodePlace,
  searchGooglePlaces,
} from "../../services/googleMapsService";
import "./LocationSearchInput.css";

export default function LocationSearchInput({
  kind,
  value,
  placeholder,
  onChange,
  onSelect,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const selectedValue = useRef("");

  useEffect(() => {
    const query = value.trim();
    if (query.length < 2 || query === selectedValue.current) {
      setSuggestions([]);
      return undefined;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        // 1. Try Google Places Autocomplete first
        const googleItems = await searchGooglePlaces(query);
        if (!active) return;
        if (googleItems && googleItems.length > 0) {
          setSuggestions(googleItems);
          setOpen(true);
          return;
        }

        // 2. Fallback to backend location search API
        const backendItems = await api.searchLocations(query);
        if (!active) return;
        setSuggestions(backendItems || []);
        if (backendItems && backendItems.length > 0) {
          setOpen(true);
        }
      } catch {
        if (active) setSuggestions([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 280);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [value]);

  const choose = async (place) => {
    selectedValue.current = place.label;
    setOpen(false);
    setSuggestions([]);

    if (Number.isFinite(place.lat) && Number.isFinite(place.lng)) {
      onSelect(place);
      return;
    }

    // Geocode Google place_id to get lat & lng
    setLoading(true);
    try {
      const geo = await geocodePlace(place.place_id || place.id || place.label);
      if (geo && Number.isFinite(geo.lat) && Number.isFinite(geo.lng)) {
        onSelect({
          id: place.id || place.place_id,
          label: place.label,
          lat: geo.lat,
          lng: geo.lng,
        });
      } else {
        onSelect(place);
      }
    } catch {
      onSelect(place);
    } finally {
      setLoading(false);
    }
  };

  const Icon = kind === "pickup" ? LocateFixed : Navigation;

  return (
    <div className="location-search">
      <div className="input-control">
        <Icon />
        <input
          value={value}
          onChange={(event) => {
            selectedValue.current = "";
            onChange(event.target.value);
          }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 200)}
          placeholder={placeholder}
          autoComplete="off"
          required
        />
        {loading && (
          <span className="location-search__loading" aria-label="מחפש כתובת" />
        )}
      </div>
      {open && suggestions.length > 0 && (
        <ul className="location-search__results">
          {suggestions.map((place) => (
            <li key={place.id || place.place_id}>
              <button type="button" onMouseDown={() => choose(place)}>
                <Icon size={16} />
                <span className="location-search__text">
                  <strong>{place.mainText || place.label}</strong>
                  {place.secondaryText && (
                    <small>{place.secondaryText}</small>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
