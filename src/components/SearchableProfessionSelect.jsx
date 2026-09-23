import React, { useState, useRef, useEffect } from 'react';
import { Briefcase, Search, ChevronDown, Check, X, Sparkles, PenTool } from 'lucide-react';

export const HIGH_LEVEL_PROFESSIONS = [
  {
    name: 'Corporate Employee',
    description: 'IT, Software, Corporate Office, MNC, Private Firm'
  },
  {
    name: 'College / University Student',
    description: 'Undergraduate, Postgraduate, Campus Commuter'
  },
  {
    name: 'Banking & Finance Professional',
    description: 'Chartered Accountant (CA), Banking, Financial Services'
  },
  {
    name: 'Doctor & Healthcare Professional',
    description: 'Doctor, Medical Practitioner, Hospital & Clinic Staff'
  },
  {
    name: 'Professor / Teacher / Educator',
    description: 'University Professor, Lecturer, School Educator'
  },
  {
    name: 'Business Owner / Entrepreneur',
    description: 'Founder, Business Owner, Trader, Commercial Enterprise'
  },
  {
    name: 'Government & PSU Employee',
    description: 'Public Sector, Administration, Municipal, Secretariat'
  },
  {
    name: 'Lawyer & Legal Consultant',
    description: 'Advocate, Legal Advisor, Law Associate'
  },
  {
    name: 'Freelancer & Consultant',
    description: 'Independent Professional, Consultant, Self-Employed'
  }
];

export default function SearchableProfessionSelect({
  label = 'Profession / Job Category *',
  value,
  onChange,
  placeholder = 'Select your profession or role',
  required = false,
  dropUp = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customInputValue, setCustomInputValue] = useState('');
  
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const customInputRef = useRef(null);

  // Check if current value is one of standard presets
  const isStandardPreset = HIGH_LEVEL_PROFESSIONS.some(p => p.name.toLowerCase() === (value || '').toLowerCase());

  useEffect(() => {
    if (value && !isStandardPreset && value !== '__custom__') {
      setIsCustomMode(true);
      setCustomInputValue(value);
    }
  }, [value, isStandardPreset]);

  // Filter professions based on search query
  const filtered = HIGH_LEVEL_PROFESSIONS.filter((prof) =>
    prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prof.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isExactMatch = HIGH_LEVEL_PROFESSIONS.some(
    (p) => p.name.toLowerCase() === searchQuery.trim().toLowerCase()
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

  const handleSelectPreset = (profName) => {
    setIsCustomMode(false);
    setCustomInputValue('');
    onChange(profName);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSelectCustom = () => {
    setIsCustomMode(true);
    setIsOpen(false);
    setSearchQuery('');
    setTimeout(() => {
      customInputRef.current?.focus();
    }, 100);
  };

  const handleCustomSubmit = (val) => {
    setCustomInputValue(val);
    onChange(val);
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
        <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-primary" />
          <span>{label}</span>
        </label>
      )}

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={handleOpen}
        className={`w-full bg-secondary/50 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-left flex items-center justify-between transition-all ${
          isOpen ? 'border-primary ring-2 ring-primary/10 shadow-sm' : 'border-border hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <Briefcase className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className={value ? 'text-foreground' : 'text-muted-foreground font-medium'}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isOpen ? (dropUp ? '-rotate-180' : 'rotate-180') : ''}`} />
      </button>

      {/* Manual Input field if Custom is active */}
      {isCustomMode && (
        <div className="mt-2 p-2.5 rounded-xl bg-secondary/40 border border-primary/30 space-y-1 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
              <PenTool className="w-3 h-3 text-primary" /> Enter Custom Role / Job Title:
            </span>
            <button
              type="button"
              onClick={() => {
                setIsCustomMode(false);
                setCustomInputValue('');
                onChange('Corporate Employee');
              }}
              className="text-[10px] text-primary hover:underline font-bold"
            >
              Choose from list
            </button>
          </div>
          <input
            ref={customInputRef}
            type="text"
            required={required}
            placeholder="e.g. Senior Architect, Research Fellow, Content Creator"
            value={customInputValue}
            onChange={(e) => handleCustomSubmit(e.target.value)}
            className="w-full bg-card border border-border rounded-lg px-3 py-1.5 text-xs font-bold text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
      )}

      {/* Styled Dropdown Menu */}
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
                placeholder="Search profession (e.g. Corporate, Student, Doctor)..."
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

          {/* List of High-Level Options */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
            {/* Quick custom write-in prompt if user typed something not matching */}
            {searchQuery.trim() && !isExactMatch && (
              <button
                type="button"
                onClick={() => {
                  handleCustomSubmit(searchQuery.trim());
                  setIsCustomMode(true);
                  setIsOpen(false);
                  setSearchQuery('');
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground flex items-center justify-between transition-all mb-1"
              >
                <span>Use custom role: "<strong>{searchQuery.trim()}</strong>"</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-foreground/20 font-bold">Custom</span>
              </button>
            )}

            {filtered.map((prof) => {
              const isSelected = value === prof.name && !isCustomMode;
              return (
                <button
                  key={prof.name}
                  type="button"
                  onClick={() => handleSelectPreset(prof.name)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                      : 'hover:bg-secondary text-foreground font-semibold'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className="block truncate">{prof.name}</span>
                    <span className={`block text-[10px] font-medium truncate ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {prof.description}
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}

            {/* Custom Write-In Option at bottom */}
            <button
              type="button"
              onClick={handleSelectCustom}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all border border-dashed border-border mt-1.5 ${
                isCustomMode
                  ? 'bg-primary text-primary-foreground font-bold'
                  : 'hover:bg-secondary text-primary font-bold bg-secondary/20'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5" />
                <span>Other / Enter Custom Role Manually...</span>
              </div>
              {isCustomMode && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
