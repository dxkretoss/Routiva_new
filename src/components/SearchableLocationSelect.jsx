import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { AHMEDABAD_LOCATIONS } from '../lib/geoUtils';

export default function SearchableLocationSelect({
  value,
  onChange,
  label,
  icon: Icon,
  placeholder = 'Select location...'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  const locations = Object.keys(AHMEDABAD_LOCATIONS).map((key) => ({
    name: key,
    label: AHMEDABAD_LOCATIONS[key].label
  }));

  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.label.toLowerCase().includes(searchQuery.toLowerCase())
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
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-secondary/50 border border-border hover:border-primary/50 rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary flex items-center justify-between transition-all shadow-sm"
      >
        <span className="truncate">
          {selectedLoc ? `${selectedLoc.name} — ${selectedLoc.label}` : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 250px Fixed Height Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-card border border-border rounded-2xl shadow-card overflow-hidden animate-fadeIn">
          {/* Search Box */}
          <div className="p-2 border-b border-border bg-secondary/30">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search area or corridor..."
                className="w-full bg-card border border-border rounded-xl pl-8 pr-3 py-1.5 text-xs font-semibold text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                autoFocus
              />
            </div>
          </div>

          {/* Location Items (Strict 250px Max Height) */}
          <div className="max-h-[250px] overflow-y-auto divide-y divide-border/40 custom-scrollbar">
            {filteredLocations.length === 0 ? (
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
                    onClick={() => {
                      onChange(loc.name);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-secondary/70 transition-colors ${
                      isSelected ? 'bg-secondary font-bold text-primary' : 'font-medium text-foreground'
                    }`}
                  >
                    <div>
                      <span className="font-bold block">{loc.name}</span>
                      <span className="text-[11px] text-muted-foreground font-normal">{loc.label}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
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
