import React, { useState } from 'react';
import { 
  Route, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Info,
  Car,
  UserCheck
} from 'lucide-react';

const INITIAL_DEMO_POINTS = [
  { id: 'p1', name: 'Naroda', address: 'Naroda Cross Road / GIDC' },
  { id: 'p2', name: 'Memco', address: 'Memco Cross Road' },
  { id: 'p3', name: 'Shahibaug', address: 'Shahibaug Underpass' },
  { id: 'p4', name: 'Income Tax', address: 'Ashram Road Circle' },
  { id: 'p5', name: 'Vijay Cross Road', address: 'Navrangpura Hub' },
  { id: 'p6', name: 'Gurukul', address: 'Memnagar Main Road' }
];

export default function FullRouteSection() {
  const [routePoints, setRoutePoints] = useState(INITIAL_DEMO_POINTS);
  const [newPointInput, setNewPointInput] = useState('');

  const handleAddPoint = (e) => {
    e.preventDefault();
    if (!newPointInput.trim()) return;
    const newPt = {
      id: `p_${Date.now()}`,
      name: newPointInput.trim(),
      address: 'En-route stop'
    };
    setRoutePoints([...routePoints, newPt]);
    setNewPointInput('');
  };

  const handleDeletePoint = (id) => {
    setRoutePoints(routePoints.filter((p) => p.id !== id));
  };

  return (
    <section id="full-route" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider border border-border inline-block mb-3">
            Core Matching Innovation
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            "Your Destination Doesn't Have to Be Their Destination."
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mt-4 leading-relaxed font-medium">
            Unlike traditional carpools that require matching both end-points, Routiva matches commuters 
            along any continuous segment of the Rider's full sequenced daily path.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Left Column: Conceptual Breakdown */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-card">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Route className="w-5 h-5 text-primary" />
                The Ahmedabad Real-World Example
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="bg-secondary/50 p-4 rounded-2xl border border-border">
                  <div className="flex items-center justify-between text-foreground font-bold mb-1">
                    <span className="flex items-center gap-1">
                      <Car className="w-4 h-4 text-primary" /> Rider: Rahul
                    </span>
                    <span className="text-primary">Nikol → Thaltej</span>
                  </div>
                  <p className="text-muted-foreground text-xs font-medium">
                    Full daily journey across eastern to western Ahmedabad.
                  </p>
                </div>

                <div className="bg-secondary/50 p-4 rounded-2xl border border-border">
                  <div className="flex items-center justify-between text-foreground font-bold mb-1">
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-4 h-4 text-orange-500" /> Seeker: Ananya
                    </span>
                    <span className="text-orange-600">Nikol → Vijay Cross Road</span>
                  </div>
                  <p className="text-muted-foreground text-xs font-medium">
                    Needs a ride only to her office at Navrangpura.
                  </p>
                </div>

                <div className="bg-orange-50/80 p-4 rounded-2xl border border-primary/30">
                  <div className="flex items-center gap-2 text-foreground font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    MATCH CONFIRMED
                  </div>
                  <p className="text-foreground text-xs leading-relaxed font-medium">
                    Vijay Cross Road is stop #5 on Rahul's sequence. Ananya gets dropped off directly at her office, 
                    and Rahul continues through Gurukul to his office in Thaltej without detour!
                  </p>
                </div>
              </div>
            </div>

            {/* Sequence Rule Explanation */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Strict Directional Sequencing
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Routiva ensures the Drop Point sequence index is strictly greater than the Pickup index. 
                Reverse trips (e.g. Vijay Cross Road → Nikol on a morning eastbound commute) are automatically filtered out.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Route Points Sequence Simulator */}
          <div className="lg:col-span-6 bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-glow">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
              <div>
                <h3 className="text-sm font-bold text-foreground">Rider's Sequenced Route Points</h3>
                <p className="text-xs text-muted-foreground">Add or manage intermediate checkpoints</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-bold border border-border">
                {routePoints.length + 2} Total Points
              </span>
            </div>

            {/* Vertical Timeline */}
            <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-primary/30">
              {/* Origin */}
              <div className="relative flex items-center justify-between p-3 rounded-2xl bg-secondary/80 border border-border">
                <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-primary text-primary-foreground font-bold text-[10px] flex items-center justify-center shadow-sm">
                  S
                </span>
                <div>
                  <div className="text-xs font-bold text-foreground">Nikol (Origin)</div>
                  <div className="text-[10px] text-muted-foreground font-semibold">East Ahmedabad • Departure Point</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-card text-foreground font-bold border border-border">
                  Seq #0
                </span>
              </div>

              {/* Dynamic Route Stops */}
              {routePoints.map((pt, idx) => (
                <div 
                  key={pt.id}
                  className={`relative flex items-center justify-between p-3 rounded-2xl transition-all ${
                    pt.name === 'Vijay Cross Road'
                      ? 'bg-orange-50 border-2 border-primary shadow-sm'
                      : 'bg-card border border-border hover:border-slate-300'
                  }`}
                >
                  <span className={`absolute -left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center ${
                    pt.name === 'Vijay Cross Road'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary border border-border text-foreground'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      {pt.name}
                      {pt.name === 'Vijay Cross Road' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary text-primary-foreground font-bold">
                          Seeker Drop Hub
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-medium">{pt.address}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-mono">Seq #{idx + 1}</span>
                    <button
                      onClick={() => handleDeletePoint(pt.id)}
                      className="text-muted-foreground hover:text-rose-600 p-1"
                      title="Remove route point"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Destination */}
              <div className="relative flex items-center justify-between p-3 rounded-2xl bg-secondary/80 border border-border">
                <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-foreground text-background font-bold text-[10px] flex items-center justify-center">
                  D
                </span>
                <div>
                  <div className="text-xs font-bold text-foreground">Thaltej (Destination)</div>
                  <div className="text-[10px] text-muted-foreground font-semibold">West Ahmedabad • Rider Final Destination</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-card text-foreground font-bold border border-border">
                  Seq #{routePoints.length + 1}
                </span>
              </div>
            </div>

            {/* Add Point Form */}
            <form onSubmit={handleAddPoint} className="mt-5 flex gap-2">
              <input
                type="text"
                placeholder="Add stop (e.g. Science City, Gota...)"
                value={newPointInput}
                onChange={(e) => setNewPointInput(e.target.value)}
                className="flex-1 bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs flex items-center gap-1 transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Add Stop
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
