import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, X, MapPin } from 'lucide-react';
import { AHMEDABAD_LOCATIONS } from '../lib/geoUtils';

// Helper to normalize search aliases (e.g. 'iscon' -> 'iskcon')
function normalizeSearchText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/\biscon\b/g, 'iskcon')
    .replace(/\bsg\b/g, 'sg highway')
    .trim();
}

export default function SearchableLocationSelect({
  value,
  onChange,
  label,
  icon: Icon = MapPin,
  placeholder = 'Select location...'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  const locations = Object.keys(AHMEDABAD_LOCATIONS).map((key) => ({
    name: key,
    label: AHMEDABAD_LOCATIONS[key].label
  }));

  const normalizedQuery = normalizeSearchText(searchQuery);

  const filteredLocations = locations.filter((loc) => {
    const locNameNorm = loc.name.toLowerCase();
    const locLabelNorm = loc.label.toLowerCase();
    const rawQuery = searchQuery.toLowerCase().trim();

    return (
      locNameNorm.includes(rawQuery) ||
      locLabelNorm.includes(rawQuery) ||
      locNameNorm.includes(normalizedQuery) ||
      locLabelNorm.includes(normalizedQuery)
    );
  });

  const isExactMatch = locations.some(
    (l) => l.name.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (locName) => {
    onChange(locName);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredLocations.length > 0) {
        handleSelect(filteredLocations[0].name);
      } else if (searchQuery.trim()) {
        handleSelect(searchQuery.trim());
      }
    }
  };

  const selectedLoc = locations.find((l) => l.name === value);

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
          {Icon && <Icon className="w-3.5 h-3.5 text-primary" />}
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
          }
        }}
        className={`w-full bg-secondary/50 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-left flex items-center justify-between transition-all shadow-sm ${
          isOpen ? 'border-primary ring-2 ring-primary/10' : 'border-border hover:border-primary/50'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className={value ? 'text-foreground truncate' : 'text-muted-foreground font-medium'}>
            {selectedLoc ? `${selectedLoc.name} — ${selectedLoc.label}` : (value ? `${value} (Custom Area)` : placeholder)}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
          {/* Search Box */}
          <div className="p-2.5 border-b border-border bg-secondary/30">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search area or enter custom location..."
                className="w-full bg-card border border-border rounded-xl pl-8 pr-8 py-2 text-xs font-semibold text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Location Items List */}
          <div className="max-h-[250px] overflow-y-auto p-1.5 space-y-1 custom-scrollbar">
            {/* Prominent Custom Location Write-in Button */}
            {searchQuery.trim() && !isExactMatch && (
              <button
                type="button"
                onClick={() => handleSelect(searchQuery.trim())}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground flex items-center justify-between transition-all mb-1"
              >
                <span>Use custom location: "<strong>{searchQuery.trim()}</strong>"</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-foreground/20 font-bold">Custom</span>
              </button>
            )}

            {filteredLocations.length === 0 && !searchQuery.trim() ? (
              <div className="p-4 text-center text-xs text-muted-foreground font-medium">
                No matching location found
              </div>
            ) : (
              filteredLocations.map((loc) => {
                const isSelected = loc.name === value;
                return (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => handleSelect(loc.name)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                        : 'hover:bg-secondary text-foreground font-semibold'
                    }`}
                  >
                    <div>
                      <span className="block">{loc.name}</span>
                      <span className={`text-[10px] block font-medium ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {loc.label}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
