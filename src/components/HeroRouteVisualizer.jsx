import React, { useState, useEffect } from 'react';
import { 
  Car, 
  User, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles,
  Users,
  Clock,
  Check
} from 'lucide-react';

const RIDER_STOPS = [
  { id: 1, name: 'Nikol', note: 'Start Point', seekerAction: 'Seeker Joins Ride' },
  { id: 2, name: 'Naroda', note: 'En Route Point', seekerAction: 'Traveling Together' },
  { id: 3, name: 'Memco', note: 'En Route Point', seekerAction: 'Traveling Together' },
  { id: 4, name: 'Shahibaug', note: 'En Route Point', seekerAction: 'Traveling Together' },
  { id: 5, name: 'Income Tax', note: 'Ashram Road', seekerAction: 'Traveling Together' },
  { id: 6, name: 'Vijay Cross Road', note: 'Seeker Destination', seekerAction: 'Seeker Dropped Off Successfully' },
  { id: 7, name: 'Gurukul', note: 'En Route Point', seekerAction: 'Rider Continues Solo' },
  { id: 8, name: 'Thaltej', note: 'Rider Final Destination', seekerAction: 'Trip Completed' }
];

export default function HeroRouteVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % RIDER_STOPS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentStop = RIDER_STOPS[currentStep];
  const isSeekerOnboard = currentStep >= 0 && currentStep <= 5;
  const isSeekerDropped = currentStep > 5;

  return (
    <div className="w-full glass-panel-glow rounded-3xl p-5 sm:p-7 border border-border overflow-hidden relative shadow-card">
      {/* Background Decorative Subtle Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-border">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Live Route Overlap Simulation
            </span>
          </div>
          <p className="text-sm font-bold text-foreground mt-1.5">
            "Same route doesn't mean same destination."
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-card border border-border hover:border-primary text-foreground transition-all shadow-sm"
            title={isPlaying ? 'Pause simulation' : 'Play simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-foreground" /> : <Play className="w-4 h-4 text-primary" />}
          </button>
          <button
            onClick={() => { setCurrentStep(0); setIsPlaying(true); }}
            className="p-2 rounded-xl bg-card border border-border hover:border-primary text-foreground transition-all shadow-sm"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Commuter Profiles Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10">
        {/* Rider Card */}
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary font-bold shadow-sm">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-foreground text-sm">Rahul (Rider)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold">
                  Hyundai i20
                </span>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
                <span className="text-foreground font-bold">Nikol</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-foreground font-bold">Thaltej</span>
                <span>• 8:30 AM</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-muted-foreground block">Full Route</span>
            <span className="text-xs font-bold text-primary">8 Key Stops</span>
          </div>
        </div>

        {/* Seeker Card */}
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary font-bold shadow-sm">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-foreground text-sm">Ananya (Seeker)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold">
                  Needs Ride
                </span>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
                <span className="text-foreground font-bold">Nikol</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-foreground font-bold">Vijay Cross Rd</span>
                <span>• 8:35 AM</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-muted-foreground block">Match Status</span>
            <span className="text-xs font-bold text-primary flex items-center justify-end gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 98% Match
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Animated Route Progress Bar */}
      <div className="relative z-10 bg-secondary/50 border border-border rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span className="font-semibold flex items-center gap-1 text-foreground">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            Current Vehicle Location:
          </span>
          <span className="font-bold text-foreground bg-card px-2.5 py-1 rounded-lg border border-border shadow-sm">
            {currentStop.name} ({currentStop.note})
          </span>
        </div>

        {/* Horizontal Node Track */}
        <div className="relative pt-6 pb-4">
          {/* Base Track Line */}
          <div className="absolute top-10 left-3 right-3 h-2 bg-border rounded-full -translate-y-1/2"></div>
          
          {/* Traveled Rider Route Line */}
          <div 
            className="absolute top-10 left-3 h-2 bg-gradient-to-r from-primary to-orange-400 rounded-full -translate-y-1/2 transition-all duration-700 shadow-glow"
            style={{ width: `${(currentStep / (RIDER_STOPS.length - 1)) * 100}%` }}
          ></div>

          {/* Shared Seeker Segment Highlight */}
          <div 
            className="absolute top-10 left-3 h-2 bg-primary/30 rounded-full -translate-y-1/2 pointer-events-none"
            style={{ width: `${(5 / (RIDER_STOPS.length - 1)) * 100}%` }}
          ></div>

          {/* Route Stop Nodes */}
          <div className="relative flex justify-between">
            {RIDER_STOPS.map((stop, index) => {
              const isPassed = index <= currentStep;
              const isCurrent = index === currentStep;
              const isSeekerSegment = index <= 5;

              return (
                <div 
                  key={stop.id}
                  onClick={() => { setCurrentStep(index); setIsPlaying(false); }}
                  className="flex flex-col items-center cursor-pointer group"
                  style={{ width: `${100 / RIDER_STOPS.length}%` }}
                >
                  {/* Node Circle */}
                  <div 
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isCurrent 
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/30 scale-125 z-20 shadow-glow' 
                        : isPassed 
                        ? 'bg-primary text-primary-foreground z-10' 
                        : isSeekerSegment
                        ? 'bg-card border-2 border-primary text-primary'
                        : 'bg-card border border-border text-muted-foreground'
                    }`}
                  >
                    {isPassed && !isCurrent ? <Check className="w-3.5 h-3.5" /> : index + 1}
                  </div>

                  {/* Node Label */}
                  <div className="mt-2 text-center">
                    <span className={`text-[11px] sm:text-xs font-semibold block transition-colors leading-tight ${
                      isCurrent 
                        ? 'text-primary font-bold' 
                        : isPassed 
                        ? 'text-foreground' 
                        : 'text-muted-foreground'
                    }`}>
                      {stop.name}
                    </span>
                    {index === 0 && (
                      <span className="text-[9px] text-primary font-bold block">Pickup</span>
                    )}
                    {index === 5 && (
                      <span className="text-[9px] text-orange-600 font-bold block">Drop Point</span>
                    )}
                    {index === 7 && (
                      <span className="text-[9px] text-muted-foreground font-medium block">Final Stop</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Status Message */}
        <div className="mt-4 p-3.5 rounded-xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground font-semibold flex items-center gap-1.5">
              {isSeekerOnboard ? (
                <>
                  <Users className="w-4 h-4 text-primary" />
                  <span>In Vehicle Together</span>
                </>
              ) : isSeekerDropped ? (
                <>
                  <Car className="w-4 h-4 text-primary" />
                  <span>Rider Solo Segment</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Waiting at Pickup</span>
                </>
              )}
            </span>
            <span className="text-foreground font-bold">
              {currentStop.seekerAction}
            </span>
          </div>

          <div className="text-xs text-primary font-bold bg-secondary px-3 py-1.5 rounded-lg border border-border">
            Matched because Vijay Cross Road is on the Rider's route
          </div>
        </div>
      </div>
    </div>
  );
}
