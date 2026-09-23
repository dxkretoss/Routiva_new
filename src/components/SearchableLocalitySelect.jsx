import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, ChevronDown, Check, X } from 'lucide-react';

export const ALL_LOCALITIES = [
  // Ahmedabad - West & Central
  { name: 'Thaltej', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'Bodakdev', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'Vastrapur', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'Satellite', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'Prahlad Nagar', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'SG Highway', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'Science City', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'Navrangpura', region: 'Ahmedabad Central', city: 'Ahmedabad' },
  { name: 'CG Road', region: 'Ahmedabad Central', city: 'Ahmedabad' },
  { name: 'Ashram Road', region: 'Ahmedabad Central', city: 'Ahmedabad' },
  { name: 'Income Tax', region: 'Ahmedabad Central', city: 'Ahmedabad' },
  { name: 'Paldi', region: 'Ahmedabad Central', city: 'Ahmedabad' },
  { name: 'Usmanpura', region: 'Ahmedabad Central', city: 'Ahmedabad' },
  { name: 'Memnagar', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'Gurukul', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'Drive In Road', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'Naranpura', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'Ambawadi', region: 'Ahmedabad Central', city: 'Ahmedabad' },
  { name: 'Ellis Bridge', region: 'Ahmedabad Central', city: 'Ahmedabad' },
  { name: 'Jodhpur', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'Vejalpur', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'Makarba', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'South Bopal', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'Bopal', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'Shela', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'Shilaj', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'Sindhu Bhavan Road', region: 'Ahmedabad West', city: 'Ahmedabad' },
  { name: 'Gota', region: 'Ahmedabad North-West', city: 'Ahmedabad' },
  { name: 'Chandlodiya', region: 'Ahmedabad North-West', city: 'Ahmedabad' },
  { name: 'Ranip', region: 'Ahmedabad North', city: 'Ahmedabad' },
  { name: 'New Ranip', region: 'Ahmedabad North', city: 'Ahmedabad' },

  // Ahmedabad - East & North
  { name: 'Nikol', region: 'Ahmedabad East', city: 'Ahmedabad' },
  { name: 'Naroda', region: 'Ahmedabad East', city: 'Ahmedabad' },
  { name: 'Bapunagar', region: 'Ahmedabad East', city: 'Ahmedabad' },
  { name: 'Viratnagar', region: 'Ahmedabad East', city: 'Ahmedabad' },
  { name: 'Odhav', region: 'Ahmedabad East', city: 'Ahmedabad' },
  { name: 'Vastral', region: 'Ahmedabad East', city: 'Ahmedabad' },
  { name: 'Ramol', region: 'Ahmedabad East', city: 'Ahmedabad' },
  { name: 'Amraiwadi', region: 'Ahmedabad East', city: 'Ahmedabad' },
  { name: 'Maninagar', region: 'Ahmedabad South-East', city: 'Ahmedabad' },
  { name: 'Isanpur', region: 'Ahmedabad South-East', city: 'Ahmedabad' },
  { name: 'Ghodasar', region: 'Ahmedabad South-East', city: 'Ahmedabad' },
  { name: 'CTM', region: 'Ahmedabad East', city: 'Ahmedabad' },
  { name: 'Jasodanagar', region: 'Ahmedabad East', city: 'Ahmedabad' },
  { name: 'Shahibaug', region: 'Ahmedabad Central-East', city: 'Ahmedabad' },
  { name: 'Memco', region: 'Ahmedabad East', city: 'Ahmedabad' },
  { name: 'Asarwa', region: 'Ahmedabad Central-East', city: 'Ahmedabad' },
  { name: 'Narol', region: 'Ahmedabad South', city: 'Ahmedabad' },
  { name: 'Vatva GIDC', region: 'Ahmedabad South-East', city: 'Ahmedabad' },
  { name: 'Krishnanagar', region: 'Ahmedabad East', city: 'Ahmedabad' },
  { name: 'Naroda GIDC', region: 'Ahmedabad East', city: 'Ahmedabad' },
  { name: 'Hansol / Airport Road', region: 'Ahmedabad North-East', city: 'Ahmedabad' },
  { name: 'Motera', region: 'Ahmedabad North', city: 'Ahmedabad' },
  { name: 'Chandkheda', region: 'Ahmedabad North', city: 'Ahmedabad' },
  { name: 'Sabarmati', region: 'Ahmedabad North', city: 'Ahmedabad' },
  { name: 'Tragad', region: 'Ahmedabad North', city: 'Ahmedabad' },
  { name: 'Jagatpur', region: 'Ahmedabad North', city: 'Ahmedabad' },

  // Gandhinagar & GIFT City Corridor
  { name: 'GIFT City', region: 'GIFT City & SEZ', city: 'Gandhinagar' },
  { name: 'Infocity Gandhinagar', region: 'Gandhinagar IT Hub', city: 'Gandhinagar' },
  { name: 'Kudasan', region: 'Gandhinagar South', city: 'Gandhinagar' },
  { name: 'Raysan', region: 'Gandhinagar South', city: 'Gandhinagar' },
  { name: 'Randesan', region: 'Gandhinagar South', city: 'Gandhinagar' },
  { name: 'Sargasan', region: 'Gandhinagar South', city: 'Gandhinagar' },
  { name: 'PDPU / PDEU Road', region: 'Gandhinagar Campus', city: 'Gandhinagar' },
  { name: 'Bhaijipura', region: 'Gandhinagar South', city: 'Gandhinagar' },
  { name: 'Koba Circle', region: 'Gandhinagar Corridor', city: 'Gandhinagar' },
  { name: 'Sector 1 to 7', region: 'Gandhinagar Capital', city: 'Gandhinagar' },
  { name: 'Sector 8 to 14', region: 'Gandhinagar Capital', city: 'Gandhinagar' },
  { name: 'Sector 15 to 21', region: 'Gandhinagar Capital', city: 'Gandhinagar' },
  { name: 'Sector 22 to 30', region: 'Gandhinagar Capital', city: 'Gandhinagar' },
  { name: 'Adalaj', region: 'Gandhinagar West', city: 'Gandhinagar' },
  { name: 'Uvarsad', region: 'Gandhinagar West', city: 'Gandhinagar' },
  { name: 'Vavol', region: 'Gandhinagar North', city: 'Gandhinagar' },
  { name: 'Chiloda', region: 'Gandhinagar East', city: 'Gandhinagar' }
];

export default function SearchableLocalitySelect({
  label,
  value,
  onChange,
  placeholder = 'Select locality in Ahmedabad / Gandhinagar',
  required = false,
  dropUp = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter localities based on search query
  const filtered = ALL_LOCALITIES.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered by region/city
  const isExactMatch = ALL_LOCALITIES.some(
    (l) => l.name.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (locName) => {
    onChange(locName);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-foreground mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleOpen}
        className={`w-full bg-secondary/50 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-left flex items-center justify-between transition-all ${
          isOpen ? 'border-primary ring-2 ring-primary/10 shadow-sm' : 'border-border hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className={value ? 'text-foreground' : 'text-muted-foreground font-medium'}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isOpen ? (dropUp ? '-rotate-180' : 'rotate-180') : ''}`} />
      </button>

      {/* Dropdown Menu (Opens upwards if dropUp is true) */}
      {isOpen && (
        <div className={`absolute z-50 left-0 right-0 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-fadeIn ${
          dropUp ? 'bottom-full mb-2' : 'top-full mt-1.5'
        }`}>
          {/* Search Box */}
          <div className="p-2.5 border-b border-border bg-secondary/30">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search area (e.g. Nikol, Thaltej, Kudasan)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card border border-border rounded-xl pl-8 pr-8 py-2 text-xs font-bold text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* List of Localities */}
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-1">
            {/* Custom search write-in option if user typed something unique */}
            {searchQuery.trim() && !isExactMatch && (
              <button
                type="button"
                onClick={() => handleSelect(searchQuery.trim())}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground flex items-center justify-between transition-all mb-1"
              >
                <span>Use custom locality: "<strong>{searchQuery.trim()}</strong>"</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-foreground/20 font-bold">Custom</span>
              </button>
            )}

            {filtered.length === 0 && !searchQuery.trim() ? (
              <div className="p-4 text-center text-xs text-muted-foreground font-medium">
                No matching localities found.
              </div>
            ) : (
              filtered.map((loc) => {
                const isSelected = value === loc.name;
                return (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => handleSelect(loc.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                        : 'hover:bg-secondary text-foreground font-semibold'
                    }`}
                  >
                    <div>
                      <span>{loc.name}</span>
                      <span className={`block text-[10px] font-medium ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {loc.region} • {loc.city}
                      </span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
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
