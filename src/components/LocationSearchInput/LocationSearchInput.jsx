import { useEffect, useRef, useState } from "react";
import { LocateFixed, Navigation } from "lucide-react";
import { api } from "../../api";
import "./LocationSearchInput.css";

export default function LocationSearchInput({ kind, value, placeholder, onChange, onSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const selectedValue = useRef("");

  useEffect(() => {
    const query = value.trim();
    if (query.length < 3 || query === selectedValue.current) {
      setSuggestions([]);
      return undefined;
    }

    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      api
        .searchLocations(query)
        .then((items) => {
          if (!active) return;
          setSuggestions(items);
          setOpen(true);
        })
        .catch(() => {
          if (active) setSuggestions([]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 450);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [value]);

  const choose = (place) => {
    selectedValue.current = place.label;
    setOpen(false);
    setSuggestions([]);
    onSelect(place);
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
          onFocus={() => suggestions.length && setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          autoComplete="off"
          required
        />
        {loading && <span className="location-search__loading" aria-label="מחפש כתובת" />}
      </div>
      {open && suggestions.length > 0 && (
        <ul className="location-search__results">
          {suggestions.map((place) => (
            <li key={place.id}>
              <button type="button" onMouseDown={() => choose(place)}>
                <Icon size={16} />
                <span>{place.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
