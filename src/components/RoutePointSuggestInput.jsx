import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Plus, Loader2 } from 'lucide-react';
import { AHMEDABAD_LOCATIONS } from '../lib/geoUtils';

export default function RoutePointSuggestInput({
  placeholder = 'Add stop (e.g. Viratnagar, Memco, Shahibaug)...',
  onAdd,
  buttonLabel = 'Add',
  buttonIcon: ButtonIcon = Plus,
  className = ''
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Local static locations list for 0ms instant matching
  const localList = Object.keys(AHMEDABAD_LOCATIONS).map((key) => ({
    name: key,
    description: AHMEDABAD_LOCATIONS[key].label,
    source: 'local'
  }));

  // Fetch Photon suggestions + combine with local suggestions
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const q = query.trim().toLowerCase();

    // 1. Instant local filter
    const localMatches = localList
      .filter(
        (loc) =>
          loc.name.toLowerCase().includes(q) ||
          loc.description.toLowerCase().includes(q)
      )
      .slice(0, 4);

    setSuggestions(localMatches);
    setIsOpen(true);

    // 2. Debounced remote Photon API call (OpenStreetMap)
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        // Photon API strictly biased & targeted for Ahmedabad & Gandhinagar corridor
        const searchPhrase = query.trim().toLowerCase().includes('ahmedabad') || query.trim().toLowerCase().includes('gandhinagar')
          ? query.trim()
          : `${query.trim()} Ahmedabad`;

        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(
            searchPhrase
          )}&lat=23.03&lon=72.58&limit=8`
        );

        if (res.ok) {
          const data = await res.json();
          // Filter strictly within Ahmedabad & Gandhinagar bounding box (Lat 22.80-23.40, Lng 72.30-72.85)
          const remoteResults = (data.features || [])
            .filter((f) => {
              const coords = f.geometry?.coordinates; // [lng, lat]
              if (!coords || coords.length < 2) return false;
              const [lng, lat] = coords;
              const inBoundingBox = lat >= 22.80 && lat <= 23.40 && lng >= 72.30 && lng <= 72.85;
              const props = f.properties || {};
              const textMatches =
                (props.city && (props.city.includes('Ahmedabad') || props.city.includes('Gandhinagar'))) ||
                (props.district && (props.district.includes('Ahmedabad') || props.district.includes('Gandhinagar'))) ||
                (props.county && (props.county.includes('Ahmedabad') || props.county.includes('Gandhinagar'))) ||
                (props.state === 'Gujarat');
              return inBoundingBox || textMatches;
            })
            .map((f) => {
              const props = f.properties;
              const name = props.name || props.street || props.district || props.city;
              const details = [props.street, props.district || props.city, 'Ahmedabad / Gandhinagar']
                .filter(Boolean)
                .join(', ');
              return {
                name: name || query.trim(),
                description: details,
                source: 'photon'
              };
            });

          // Merge local and remote avoiding duplicate names
          const existingNames = new Set(localMatches.map((m) => m.name.toLowerCase()));
          const combined = [
            ...localMatches,
            ...remoteResults.filter((r) => !existingNames.has(r.name.toLowerCase()))
          ];

          setSuggestions(combined.slice(0, 6));
        }
      } catch (err) {
        console.warn('Photon API fetch error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSelect = (item) => {
    onAdd(item.name);
    setQuery('');
    setIsOpen(false);
  };

  const handleFormSubmit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    onAdd(query.trim());
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
          {loading && (
            <Loader2 className="w-3.5 h-3.5 text-primary absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs rounded-xl shadow-glow flex items-center gap-1 shrink-0 transition-all"
        >
          {ButtonIcon && <ButtonIcon className="w-3.5 h-3.5" />} {buttonLabel}
        </button>
      </form>

      {/* Auto-suggest Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
          <div className="p-1 space-y-0.5 max-h-52 overflow-y-auto custom-scrollbar">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-foreground block truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground block truncate">
                      {item.description}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary border border-border text-muted-foreground shrink-0 ml-2 font-semibold">
                  {item.source === 'local' ? 'Local Area' : 'OSM'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
