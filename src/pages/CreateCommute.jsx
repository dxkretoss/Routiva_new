import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Navigation, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Sparkles,
  Car,
  Fuel,
  Users,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Check,
  Info
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import LeafletRouteMap from '../components/LeafletRouteMap';
import SearchableLocationSelect from '../components/SearchableLocationSelect';
import RoutePointSuggestInput from '../components/RoutePointSuggestInput';
import TimePickerInput from '../components/TimePickerInput';
import { useCommute } from '../context/CommuteContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { AHMEDABAD_LOCATIONS, getLocationCoords } from '../lib/geoUtils';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CreateCommute() {
  const navigate = useNavigate();
  const { role, vehicle } = useAuth();
  const { createCommute } = useCommute();
  const { addToast } = useNotifications();

  const [step, setStep] = useState(1);
  const commuteType = role === 'seeker' ? 'seeker' : 'rider';
  const [loading, setLoading] = useState(false);

  // Commute Form Data
  const [startLocation, setStartLocation] = useState('Nikol');
  const [destinationLocation, setDestinationLocation] = useState('Thaltej');
  const [routePoints, setRoutePoints] = useState([
    { name: 'Naroda', sequence_order: 1 },
    { name: 'Memco', sequence_order: 2 },
    { name: 'Shahibaug', sequence_order: 3 },
    { name: 'Income Tax', sequence_order: 4 },
    { name: 'Vijay Cross Road', sequence_order: 5 },
    { name: 'Gurukul', sequence_order: 6 }
  ]);
  const [newPointName, setNewPointName] = useState('');

  // Preferred Points
  const [preferredPickups, setPreferredPickups] = useState([
    { name: 'Near Naroda Bridge', point_type: 'pickup', sequence_order: 1 },
    { name: 'Airport Road Circle', point_type: 'pickup', sequence_order: 2 }
  ]);
  const [preferredDrops, setPreferredDrops] = useState([
    { name: 'Vijay Cross Road Bus Stand', point_type: 'drop', sequence_order: 1 },
    { name: 'Gujarat University Gate', point_type: 'drop', sequence_order: 2 }
  ]);

  // Schedule & Timing
  const [days, setDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [departureTime, setDepartureTime] = useState('8:30 AM');
  const [flexibilityMinutes, setFlexibilityMinutes] = useState(15);
  const [returnTime, setReturnTime] = useState('6:30 PM');

  // Preferences & Contribution
  const [genderPreference, setGenderPreference] = useState('any');
  const [maxPickupKm, setMaxPickupKm] = useState(2.5);
  const [maxDropKm, setMaxDropKm] = useState(2.5);
  const [contributionType, setContributionType] = useState('petrol_split');
  const [contributionAmount, setContributionAmount] = useState(55);
  const [availableSeats, setAvailableSeats] = useState(vehicle?.available_seats || 2);

  const toggleDay = (d) => {
    if (days.includes(d)) {
      if (days.length > 1) setDays(days.filter((day) => day !== d));
    } else {
      setDays([...days, d]);
    }
  };

  const handleDeleteRoutePoint = (idx) => {
    setRoutePoints(routePoints.filter((_, i) => i !== idx));
  };

  const handleSubmitCommute = async () => {
    setLoading(true);
    const startCoord = getLocationCoords(startLocation);
    const destCoord = getLocationCoords(destinationLocation);

    const payload = {
      commute_type: commuteType,
      start_location: startLocation,
      start_lat: startCoord.lat,
      start_lng: startCoord.lng,
      destination_location: destinationLocation,
      destination_lat: destCoord.lat,
      destination_lng: destCoord.lng,
      days,
      departure_time: departureTime,
      flexibility_minutes: flexibilityMinutes,
      return_time: returnTime,
      gender_preference: genderPreference,
      max_pickup_km: maxPickupKm,
      max_drop_km: maxDropKm,
      contribution_type: contributionType,
      contribution_amount: contributionAmount,
      available_seats: commuteType === 'rider' ? availableSeats : 1,
      route_points: commuteType === 'rider' ? routePoints : [],
      preferred_route_points: [...preferredPickups, ...preferredDrops]
    };

    try {
      await createCommute(payload);
      addToast('Commute corridor created successfully!', 'success');
      navigate('/matches');
    } catch (err) {
      addToast(err.message || 'Failed to create commute.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Corridor Endpoints', desc: 'Origin & Destination' },
    { num: 2, title: 'En-Route Stops', desc: 'Intermediate Points' },
    { num: 3, title: 'Pickup & Drop', desc: 'Preferred Landmarks' },
    { num: 4, title: 'Schedule & Launch', desc: 'Timing & Cost Split' }
  ];

  return (
    <DashboardLayout
      title="Create Commute Corridor"
      subtitle="Define your daily transit route, sequenced stops, and schedule for automated commuter matching"
    >
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Step Progress Tracker */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {stepsList.map((s) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => s.num < step && setStep(s.num)}
                  disabled={s.num > step}
                  className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-xl text-left transition-all ${
                    isCurrent
                      ? 'bg-primary/10 border border-primary/40 shadow-xs'
                      : isCompleted
                      ? 'bg-secondary/40 border border-border hover:bg-secondary cursor-pointer'
                      : 'opacity-50 border border-transparent cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground shadow-glow'
                        : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <div className="min-w-0">
                    <div className={`text-xs font-black truncate ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                      {s.title}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate hidden sm:block">
                      {s.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Wizard Form & Live Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Card (7 Cols) */}
          <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-5 sm:p-7 shadow-card space-y-6">
            {/* Step Header */}
            <div className="pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                  Step {step} of 4
                </span>
                <span className="text-xs font-bold text-muted-foreground">
                  {commuteType === 'rider' ? '🚗 Vehicle Owner Corridor' : '🚶 Commuter Transit'}
                </span>
              </div>
              <h2 className="text-xl font-black text-foreground mt-1">
                {step === 1 && 'Define Origin & Destination'}
                {step === 2 && 'Sequenced Route Checkpoints'}
                {step === 3 && 'Preferred Pickup & Drop Landmarks'}
                {step === 4 && 'Schedule, Timing & Cost Split'}
              </h2>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                {step === 1 && 'Select your daily origin and workplace area in Ahmedabad / Gandhinagar'}
                {step === 2 && 'Add key checkpoints and cross roads along your driving corridor'}
                {step === 3 && 'Specify landmarks where you prefer to meet and pick up co-commuters'}
                {step === 4 && 'Set departure time, operating days, and daily fuel split'}
              </p>
            </div>

            {/* STEP 1: LOCATIONS */}
            {step === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <SearchableLocationSelect
                  label="Daily Origin / Start Area *"
                  icon={MapPin}
                  value={startLocation}
                  onChange={setStartLocation}
                  placeholder="Select daily start area..."
                />

                <SearchableLocationSelect
                  label="Daily Destination *"
                  icon={Navigation}
                  value={destinationLocation}
                  onChange={setDestinationLocation}
                  placeholder="Select destination area..."
                />

                <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border text-xs text-muted-foreground flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    Routiva connects verified corporate professionals travelling along the same highway and metro corridors in Ahmedabad and Gandhinagar.
                  </span>
                </div>
              </div>
            )}

            {/* STEP 2: SEQUENCED ROUTE STOPS */}
            {step === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-1 border-b border-border">
                  <span className="text-xs font-bold text-foreground">
                    Sequenced Route Points ({routePoints.length} stops)
                  </span>
                  <span className="text-[10px] text-primary font-bold">
                    Order from origin to destination
                  </span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                  {routePoints.map((pt, idx) => (
                    <div
                      key={pt.name + idx}
                      className="p-3 bg-secondary/40 border border-border rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground font-bold text-[10px] flex items-center justify-center shadow-sm">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-foreground">{pt.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteRoutePoint(idx)}
                        className="text-muted-foreground hover:text-rose-600 p-1 transition-colors"
                        title="Remove Stop"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Live suggest input */}
                <div className="pt-2">
                  <RoutePointSuggestInput
                    placeholder="Search or type stop (e.g. Viratnagar, Memco, Shahibaug)..."
                    onAdd={(name) => {
                      setRoutePoints([
                        ...routePoints,
                        { name: name.trim(), sequence_order: routePoints.length + 1 }
                      ]);
                    }}
                    buttonLabel="Add Stop"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: PREFERRED PICKUP & DROP */}
            {step === 3 && (
              <div className="space-y-5 animate-fadeIn">
                {/* Pickups */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      Preferred Pickup Locations (Max 5)
                    </label>
                    <span className="text-[10px] text-muted-foreground font-semibold">{preferredPickups.length}/5</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                    {preferredPickups.map((p, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-xl bg-secondary border border-border text-foreground text-xs font-semibold flex items-center gap-1.5">
                        {p.name}
                        <button
                          type="button"
                          onClick={() => setPreferredPickups(preferredPickups.filter((_, i) => i !== idx))}
                          className="hover:text-rose-600 font-bold ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                  {preferredPickups.length < 5 && (
                    <RoutePointSuggestInput
                      placeholder="e.g. Near Naroda Bridge, Memco BRTS Gate..."
                      onAdd={(name) => {
                        setPreferredPickups([
                          ...preferredPickups,
                          { name: name.trim(), point_type: 'pickup', sequence_order: preferredPickups.length + 1 }
                        ]);
                      }}
                      buttonLabel="Add Pickup"
                    />
                  )}
                </div>

                {/* Drops */}
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-orange-500" />
                      Preferred Drop Locations (Max 5)
                    </label>
                    <span className="text-[10px] text-muted-foreground font-semibold">{preferredDrops.length}/5</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                    {preferredDrops.map((p, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-xl bg-secondary border border-border text-foreground text-xs font-semibold flex items-center gap-1.5">
                        {p.name}
                        <button
                          type="button"
                          onClick={() => setPreferredDrops(preferredDrops.filter((_, i) => i !== idx))}
                          className="hover:text-rose-600 font-bold ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                  {preferredDrops.length < 5 && (
                    <RoutePointSuggestInput
                      placeholder="e.g. Gujarat University Gate, Vijay Cross Rd..."
                      onAdd={(name) => {
                        setPreferredDrops([
                          ...preferredDrops,
                          { name: name.trim(), point_type: 'drop', sequence_order: preferredDrops.length + 1 }
                        ]);
                      }}
                      buttonLabel="Add Drop"
                    />
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: SCHEDULE, PREFERENCES & REVIEW */}
            {step === 4 && (
              <div className="space-y-4 animate-fadeIn">
                {/* Days */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-2">
                    Commute Days *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDay(d)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          days.includes(d)
                            ? 'bg-primary text-primary-foreground shadow-glow'
                            : 'bg-secondary text-muted-foreground border border-border hover:bg-slate-200'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timing with Interactive Time Picker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TimePickerInput
                    label="Departure Time *"
                    value={departureTime}
                    onChange={setDepartureTime}
                    dropUp={true}
                    required
                  />

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span>Flexibility Window</span>
                    </label>
                    <select
                      value={flexibilityMinutes}
                      onChange={(e) => setFlexibilityMinutes(parseInt(e.target.value, 10))}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="10">± 10 minutes</option>
                      <option value="15">± 15 minutes (Recommended)</option>
                      <option value="20">± 20 minutes</option>
                      <option value="30">± 30 minutes</option>
                    </select>
                  </div>
                </div>

                {/* Contribution & Seats (Rider) */}
                {commuteType === 'rider' && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        Available Seats Offered
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={availableSeats}
                        onChange={(e) => setAvailableSeats(parseInt(e.target.value, 10))}
                        className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1">
                        <Fuel className="w-3.5 h-3.5 text-emerald-600" /> Petrol Split / Day (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(parseInt(e.target.value, 10))}
                        className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Wizard Navigation Footer */}
            <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 rounded-xl bg-secondary border border-border hover:bg-slate-200 text-foreground font-bold text-xs transition-all"
                >
                  Previous
                </button>
              ) : <div />}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-glow flex items-center gap-1.5 transition-all"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitCommute}
                  disabled={loading}
                  className="px-7 py-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-glow flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {loading ? 'Creating Commute...' : 'Publish Corridor & Find Matches'}
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Leaflet Route Map Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-card border border-border rounded-3xl p-5 shadow-card space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-primary" /> Interactive Route Map
                </span>
                <span className="text-[10px] text-secondary-foreground bg-secondary px-2 py-0.5 rounded border border-border font-bold">
                  Live Preview
                </span>
              </div>

              <div className="rounded-2xl overflow-hidden border border-border h-72 shadow-inner">
                <LeafletRouteMap
                  startLocation={startLocation}
                  destLocation={destinationLocation}
                  routePoints={commuteType === 'rider' ? routePoints : []}
                  preferredPickups={preferredPickups}
                  preferredDrops={preferredDrops}
                  height="100%"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border text-xs text-muted-foreground space-y-1.5">
                <div className="flex justify-between font-bold text-foreground">
                  <span>Start: <strong className="text-primary">{startLocation}</strong></span>
                  <span>End: <strong className="text-primary">{destinationLocation}</strong></span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-primary font-bold">
                    {commuteType === 'rider' ? `${routePoints.length} Intermediate Stops` : 'Direct Segment Request'}
                  </span>
                  <span className="font-semibold text-foreground">
                    {departureTime} • {days.length} Days/Wk
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
