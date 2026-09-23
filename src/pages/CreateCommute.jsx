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
  Users
} from 'lucide-react';
import Navbar from '../components/Navbar';
import LeafletRouteMap from '../components/LeafletRouteMap';
import SearchableLocationSelect from '../components/SearchableLocationSelect';
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
  const [commuteType, setCommuteType] = useState(role === 'seeker' ? 'seeker' : 'rider');
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
  const [newPickupName, setNewPickupName] = useState('');
  const [newDropName, setNewDropName] = useState('');

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

  const handleAddRoutePoint = (e) => {
    e.preventDefault();
    if (!newPointName.trim()) return;
    setRoutePoints([
      ...routePoints,
      { name: newPointName.trim(), sequence_order: routePoints.length + 1 }
    ]);
    setNewPointName('');
  };

  const handleDeleteRoutePoint = (idx) => {
    setRoutePoints(routePoints.filter((_, i) => i !== idx));
  };

  const handleAddPreferredPickup = (e) => {
    e.preventDefault();
    if (!newPickupName.trim() || preferredPickups.length >= 5) return;
    setPreferredPickups([
      ...preferredPickups,
      { name: newPickupName.trim(), point_type: 'pickup', sequence_order: preferredPickups.length + 1 }
    ]);
    setNewPickupName('');
  };

  const handleAddPreferredDrop = (e) => {
    e.preventDefault();
    if (!newDropName.trim() || preferredDrops.length >= 5) return;
    setPreferredDrops([
      ...preferredDrops,
      { name: newDropName.trim(), point_type: 'drop', sequence_order: preferredDrops.length + 1 }
    ]);
    setNewDropName('');
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
      navigate('/matches');
    } catch (err) {
      addToast(err.message || 'Failed to create commute.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="px-3.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider border border-border inline-block mb-2">
            Route Wizard • Step {step} of 4
          </span>
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            {step === 1 && 'Define Your Daily Transit Corridor'}
            {step === 2 && 'Full Sequenced Route Stops'}
            {step === 3 && 'Preferred Pickup & Drop Points'}
            {step === 4 && 'Schedule, Preferences & Review'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
            {step === 1 && 'Select start, destination and commute role'}
            {step === 2 && 'Add key intermediate checkpoints you pass along the way'}
            {step === 3 && 'Specify landmarks where you are comfortable stopping'}
            {step === 4 && 'Confirm departure timing, contribution and launch matching'}
          </p>
        </div>

        {/* Wizard Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Side */}
          <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
            {/* STEP 1: LOCATIONS & ROLE */}
            {step === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Commute Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCommuteType('rider')}
                      className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        commuteType === 'rider'
                          ? 'bg-secondary border-primary text-primary shadow-sm'
                          : 'bg-card border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Car className="w-4 h-4 text-primary" />
                      Rider (Offer Empty Seats)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommuteType('seeker')}
                      className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        commuteType === 'seeker'
                          ? 'bg-secondary border-primary text-orange-600 shadow-sm'
                          : 'bg-card border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Users className="w-4 h-4 text-orange-500" />
                      Seeker (Find a Ride)
                    </button>
                  </div>
                </div>

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
              </div>
            )}

            {/* STEP 2: FULL SEQUENCED ROUTE STOPS (RIDER ONLY) */}
            {step === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-xs font-bold text-foreground">
                    Sequenced Route Points ({routePoints.length} intermediate stops)
                  </span>
                  <span className="text-[10px] text-primary font-bold">
                    Drop must come after pickup
                  </span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
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
                        className="text-muted-foreground hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add point form */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add en-route stop (e.g. Memco, Shahibaug, Income Tax)..."
                    value={newPointName}
                    onChange={(e) => setNewPointName(e.target.value)}
                    className="flex-1 bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddRoutePoint}
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs rounded-xl shadow-glow flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PREFERRED PICKUP & DROP POINTS */}
            {step === 3 && (
              <div className="space-y-5 animate-fadeIn">
                {/* Pickups */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      Preferred Pickup Locations (Max 5)
                    </label>
                    <span className="text-[10px] text-muted-foreground font-semibold">{preferredPickups.length}/5</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {preferredPickups.map((p, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-secondary border border-border text-foreground text-xs font-semibold flex items-center gap-1.5">
                        {p.name}
                        <button type="button" onClick={() => setPreferredPickups(preferredPickups.filter((_, i) => i !== idx))} className="hover:text-primary">✕</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Near Naroda Bridge, Memco BRTS Gate..."
                      value={newPickupName}
                      onChange={(e) => setNewPickupName(e.target.value)}
                      className="flex-1 bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddPreferredPickup}
                      className="px-3 py-2 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs rounded-xl shadow-sm"
                    >
                      Add Pickup
                    </button>
                  </div>
                </div>

                {/* Drops */}
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      Preferred Drop Locations (Max 5)
                    </label>
                    <span className="text-[10px] text-muted-foreground font-semibold">{preferredDrops.length}/5</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {preferredDrops.map((p, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-secondary border border-border text-foreground text-xs font-semibold flex items-center gap-1.5">
                        {p.name}
                        <button type="button" onClick={() => setPreferredDrops(preferredDrops.filter((_, i) => i !== idx))} className="hover:text-primary">✕</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Gujarat University Gate, Vijay Cross Rd..."
                      value={newDropName}
                      onChange={(e) => setNewDropName(e.target.value)}
                      className="flex-1 bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddPreferredDrop}
                      className="px-3 py-2 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs rounded-xl shadow-sm"
                    >
                      Add Drop
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: SCHEDULE & PREFERENCES */}
            {step === 4 && (
              <div className="space-y-4 animate-fadeIn">
                {/* Days */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">
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
                            : 'bg-secondary text-muted-foreground border border-border'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timing */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> Departure Time *
                    </label>
                    <input
                      type="text"
                      placeholder="8:30 AM"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Flexibility (± Minutes)
                    </label>
                    <select
                      value={flexibilityMinutes}
                      onChange={(e) => setFlexibilityMinutes(parseInt(e.target.value, 10))}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
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
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
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
                      <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1">
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

            {/* Wizard Navigation */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground font-semibold text-xs"
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
                  className="px-7 py-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-glow flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {loading ? 'Creating Commute via Edge Function...' : 'Save Commute & Find Matches'}
                </button>
              )}
            </div>
          </div>

          {/* Right Side: Live Leaflet Map Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-card border border-border rounded-3xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-primary" /> Interactive Route Map
                </span>
                <span className="text-[10px] text-secondary-foreground bg-secondary px-2 py-0.5 rounded border border-border font-bold">
                  Live Preview
                </span>
              </div>

              <LeafletRouteMap
                startLocation={startLocation}
                destLocation={destinationLocation}
                routePoints={commuteType === 'rider' ? routePoints : []}
                preferredPickups={preferredPickups}
                preferredDrops={preferredDrops}
                height="340px"
              />

              <div className="mt-4 p-3 rounded-xl bg-secondary/40 border border-border text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between font-medium">
                  <span>Start: <strong className="text-foreground">{startLocation}</strong></span>
                  <span>End: <strong className="text-foreground">{destinationLocation}</strong></span>
                </div>
                <div className="text-[11px] text-primary font-bold">
                  {commuteType === 'rider' ? `${routePoints.length} Sequenced Stops` : 'Direct Segment Request'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
