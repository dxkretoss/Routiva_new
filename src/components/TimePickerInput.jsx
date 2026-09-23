import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown, Check, Sparkles } from 'lucide-react';

const HOURS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
const PERIODS = ['AM', 'PM'];

const QUICK_COMMUTE_PRESETS = [
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM'
];

function parseTimeString(str = '8:30 AM') {
  try {
    const parts = str.trim().split(' ');
    const time = parts[0] || '8:30';
    const period = (parts[1] || 'AM').toUpperCase();
    const [h, m] = time.split(':');
    const hour = String(parseInt(h, 10) || 8).padStart(2, '0');
    const minVal = parseInt(m, 10) || 0;
    // Round to nearest 5 min preset
    const roundedMin = Math.round(minVal / 5) * 5;
    const min = String(roundedMin >= 60 ? 55 : roundedMin).padStart(2, '0');
    return {
      hour: HOURS.includes(hour) ? hour : '08',
      minute: MINUTES.includes(min) ? min : '30',
      period: period === 'PM' ? 'PM' : 'AM'
    };
  } catch {
    return { hour: '08', minute: '30', period: 'AM' };
  }
}

export default function TimePickerInput({
  label = 'Departure Time *',
  value = '8:30 AM',
  onChange,
  dropUp = true,
  required = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const parsed = parseTimeString(value);
  const [selectedHour, setSelectedHour] = useState(parsed.hour);
  const [selectedMinute, setSelectedMinute] = useState(parsed.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(parsed.period);

  useEffect(() => {
    const p = parseTimeString(value);
    setSelectedHour(p.hour);
    setSelectedMinute(p.minute);
    setSelectedPeriod(p.period);
  }, [value]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleUpdate = (h, m, p) => {
    setSelectedHour(h);
    setSelectedMinute(m);
    setSelectedPeriod(p);
    const hourNum = parseInt(h, 10);
    const formatted = `${hourNum}:${m} ${p}`;
    onChange(formatted);
  };

  const handlePresetClick = (preset) => {
    onChange(preset);
    const p = parseTimeString(preset);
    setSelectedHour(p.hour);
    setSelectedMinute(p.minute);
    setSelectedPeriod(p.period);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span>{label}</span>
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-secondary/50 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-left flex items-center justify-between transition-all shadow-sm ${
          isOpen ? 'border-primary ring-2 ring-primary/10' : 'border-border hover:border-primary/50'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-foreground tracking-wide font-bold">
            {value || 'Select Time'}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? (dropUp ? '-rotate-180' : 'rotate-180') : ''}`} />
      </button>

      {/* Interactive Time Selection Popover */}
      {isOpen && (
        <div
          className={`absolute z-50 left-0 sm:left-auto right-0 sm:w-80 bg-card border border-border rounded-2xl shadow-2xl p-3.5 animate-fadeIn ${
            dropUp ? 'bottom-full mb-2' : 'top-full mt-1.5'
          }`}
        >
          {/* Header Preview */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-foreground tracking-tight">
                {parseInt(selectedHour, 10)}:{selectedMinute}
              </span>
              <span className="text-xs font-bold text-primary px-1.5 py-0.5 rounded-md bg-secondary border border-border">
                {selectedPeriod}
              </span>
            </div>

            {/* AM / PM Segmented Control */}
            <div className="flex items-center p-0.5 bg-secondary rounded-xl border border-border">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleUpdate(selectedHour, selectedMinute, p)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    selectedPeriod === p
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Commute Presets */}
          <div className="mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Popular Office Timings
            </span>
            <div className="grid grid-cols-5 gap-1">
              {QUICK_COMMUTE_PRESETS.map((preset) => {
                const isSelected = value === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={`py-1 px-0.5 text-[10px] font-bold rounded-lg transition-all text-center border ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-secondary/60 hover:bg-secondary text-foreground border-border'
                    }`}
                  >
                    {preset.replace(' ', '')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Column Scroll Selection */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border">
            {/* Hours Column */}
            <div>
              <span className="block text-[10px] font-bold text-muted-foreground mb-1 text-center">
                Hour
              </span>
              <div className="max-h-36 overflow-y-auto custom-scrollbar p-1 bg-secondary/30 rounded-xl border border-border space-y-0.5">
                {HOURS.map((h) => {
                  const isSelected = selectedHour === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleUpdate(h, selectedMinute, selectedPeriod)}
                      className={`w-full py-1.5 text-xs font-bold rounded-lg text-center transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'hover:bg-secondary text-foreground'
                      }`}
                    >
                      {parseInt(h, 10)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minutes Column */}
            <div>
              <span className="block text-[10px] font-bold text-muted-foreground mb-1 text-center">
                Minute
              </span>
              <div className="max-h-36 overflow-y-auto custom-scrollbar p-1 bg-secondary/30 rounded-xl border border-border space-y-0.5">
                {MINUTES.map((m) => {
                  const isSelected = selectedMinute === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleUpdate(selectedHour, m, selectedPeriod)}
                      className={`w-full py-1.5 text-xs font-bold rounded-lg text-center transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'hover:bg-secondary text-foreground'
                      }`}
                    >
                      :{m}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Done Button */}
          <div className="pt-2.5 mt-2.5 border-t border-border flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Confirm {parseInt(selectedHour, 10)}:{selectedMinute} {selectedPeriod}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
