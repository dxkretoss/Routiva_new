import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  ChevronRight,
  Car,
  User,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_RIDER = {
  name: 'Rahul Sharma',
  vehicle: 'Hyundai i20 (Polar White)',
  start: 'Nikol',
  destination: 'Thaltej',
  time: '8:30 AM',
  days: 'Mon–Fri',
  seats: 2,
  routeStops: ['Naroda', 'Memco', 'Shahibaug', 'Income Tax', 'Vijay Cross Road', 'Gurukul']
};

export default function InteractiveMatchingDemo() {
  const navigate = useNavigate();

  const [seekerPickup, setSeekerPickup] = useState('Nikol');
  const [seekerDrop, setSeekerDrop] = useState('Vijay Cross Road');
  const [seekerTime, setSeekerTime] = useState('8:35 AM');
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [stepProgress, setStepProgress] = useState(0);

  const handleRunMatch = () => {
    setIsMatching(true);
    setMatchResult(null);
    setStepProgress(0);

    const steps = [
      'Analyzing route coordinates & full sequence...',
      'Validating pickup proximity (< 2.5 km)...',
      'Verifying drop location lies on Rider route...',
      'Checking departure time window (±15 min)...',
      'Checking available seat capacity...',
      'Calculating final match compatibility...'
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setStepProgress(current);
      if (current >= steps.length) {
        clearInterval(interval);
        setIsMatching(false);

        // Evaluate logic
        const isDropOnRoute = 
          seekerDrop === 'Vijay Cross Road' || 
          seekerDrop === 'Gurukul' || 
          seekerDrop === 'Shahibaug' || 
          seekerDrop === 'Income Tax' ||
          seekerDrop === 'Thaltej';

        const isReverse = seekerPickup === 'Thaltej' && seekerDrop === 'Nikol';

        if (isReverse) {
          setMatchResult({
            isSuccess: false,
            score: 0,
            title: 'No Forward Direction Match',
            reason: 'Rider is driving Nikol → Thaltej in the morning. Your requested trip is in the reverse direction.'
          });
        } else if (!isDropOnRoute && seekerDrop !== 'Naroda' && seekerDrop !== 'Memco') {
          setMatchResult({
            isSuccess: false,
            score: 42,
            title: 'Low Route Compatibility',
            reason: `Destination (${seekerDrop}) does not fall along Rahul's daily route from Nikol to Thaltej.`
          });
        } else {
          setMatchResult({
            isSuccess: true,
            score: 98,
            title: 'Match Found Successfully',
            overlapSegment: `${seekerPickup} → ${seekerDrop}`,
            explanation: `You can share the ride from ${seekerPickup} and get dropped at ${seekerDrop} while Rahul continues his commute to Thaltej.`
          });
          try {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
          } catch (e) {}
        }
      }
    }, 400);
  };

  return (
    <section id="interactive-demo" className="py-20 relative bg-secondary/30 border-t border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider border border-border inline-block mb-3">
            Interactive Product Sandbox
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            See How Routiva Matches You
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-3 font-medium">
            Try matching a Seeker journey with an active Rider route without signing in. 
            Experience how our route sequence algorithm works in real-time.
          </p>
        </div>

        {/* Dual Panels: Rider vs Seeker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Rider Profile & Route */}
          <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-6 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold">
                  <Car className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    {SAMPLE_RIDER.name}
                    <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold">
                      Rider
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">{SAMPLE_RIDER.vehicle}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-primary block">2 Seats Left</span>
                <span className="text-[10px] text-muted-foreground">{SAMPLE_RIDER.days}</span>
              </div>
            </div>

            {/* Rider Full Sequence */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground">Rider Schedule:</span>
                <span className="text-foreground font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" /> 8:30 AM Departure
                </span>
              </div>

              <div className="bg-secondary/40 rounded-2xl p-4 border border-border">
                <div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                  Full Defined Route:
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
                  <span className="px-2 py-1 rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
                    Nikol (Start)
                  </span>
                  <span className="text-muted-foreground">→</span>
                  {SAMPLE_RIDER.routeStops.map((stop) => (
                    <React.Fragment key={stop}>
                      <span className={`px-2 py-1 rounded-lg border ${
                        stop === seekerDrop 
                          ? 'bg-primary/20 text-foreground border-primary font-bold ring-2 ring-primary/20' 
                          : 'bg-card text-foreground border-border'
                      }`}>
                        {stop}
                      </span>
                      <span className="text-muted-foreground">→</span>
                    </React.Fragment>
                  ))}
                  <span className="px-2 py-1 rounded-lg bg-card text-foreground border border-border font-bold">
                    Thaltej (End)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle / Right Panel: Seeker Input & Live Match Result */}
          <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 shadow-glow relative">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Your Seeker Travel Need</h3>
                  <p className="text-xs text-muted-foreground">Configure pickup, drop & departure time</p>
                </div>
              </div>
              <span className="text-xs text-primary font-bold bg-secondary px-2.5 py-1 rounded-lg border border-border">
                Customizable Sandbox
              </span>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  Your Pickup:
                </label>
                <select
                  value={seekerPickup}
                  onChange={(e) => setSeekerPickup(e.target.value)}
                  className="w-full bg-secondary/60 border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="Nikol">Nikol (East Ahmedabad)</option>
                  <option value="Naroda">Naroda Cross Road</option>
                  <option value="Memco">Memco</option>
                  <option value="Thaltej">Thaltej (Reverse test)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  Your Destination:
                </label>
                <select
                  value={seekerDrop}
                  onChange={(e) => setSeekerDrop(e.target.value)}
                  className="w-full bg-secondary/60 border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="Vijay Cross Road">Vijay Cross Road (Navrangpura)</option>
                  <option value="Gurukul">Gurukul Road (Memnagar)</option>
                  <option value="Shahibaug">Shahibaug Underpass</option>
                  <option value="Income Tax">Income Tax Circle</option>
                  <option value="Maninagar">Maninagar (Off route test)</option>
                  <option value="Nikol">Nikol (Reverse test)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Target Time:
                </label>
                <select
                  value={seekerTime}
                  onChange={(e) => setSeekerTime(e.target.value)}
                  className="w-full bg-secondary/60 border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="8:35 AM">8:35 AM (±5 min diff)</option>
                  <option value="8:30 AM">8:30 AM (Exact match)</option>
                  <option value="8:45 AM">8:45 AM (±15 min diff)</option>
                </select>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleRunMatch}
              disabled={isMatching}
              className="w-full py-3 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm shadow-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isMatching ? 'Running Route Matching Algorithm...' : 'Find My Match Now'}
            </button>

            {/* Animation Steps */}
            {isMatching && (
              <div className="mt-4 p-4 rounded-2xl bg-secondary border border-border animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-foreground mb-2 font-semibold">
                  <span>Step {stepProgress} of 6</span>
                  <span className="text-primary animate-pulse">Processing...</span>
                </div>
                <div className="w-full bg-card h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${(stepProgress / 6) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Result Card */}
            {matchResult && (
              <div className={`mt-5 p-5 rounded-2xl border animate-fadeIn ${
                matchResult.isSuccess 
                  ? 'bg-orange-50/70 border-primary/30' 
                  : 'bg-rose-50 border-rose-200'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-extrabold ${matchResult.isSuccess ? 'text-foreground' : 'text-rose-600'}`}>
                        {matchResult.title}
                      </span>
                      {matchResult.isSuccess && (
                        <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                          {matchResult.score}% Compatibility
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-medium">
                      {matchResult.explanation || matchResult.reason}
                    </p>
                  </div>
                </div>

                {matchResult.isSuccess && (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-border text-xs">
                      <div className="bg-card p-2 rounded-xl border border-border">
                        <span className="text-muted-foreground block text-[10px]">Route Overlap</span>
                        <span className="font-bold text-foreground">Direct On-Route</span>
                      </div>
                      <div className="bg-card p-2 rounded-xl border border-border">
                        <span className="text-muted-foreground block text-[10px]">Pickup Tolerance</span>
                        <span className="font-bold text-foreground">0.0 km (Same Point)</span>
                      </div>
                      <div className="bg-card p-2 rounded-xl border border-border">
                        <span className="text-muted-foreground block text-[10px]">Time Difference</span>
                        <span className="font-bold text-foreground">±5 mins</span>
                      </div>
                      <div className="bg-card p-2 rounded-xl border border-border">
                        <span className="text-muted-foreground block text-[10px]">Seats Available</span>
                        <span className="font-bold text-primary">2 Seats</span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-sm">
                      <span className="text-xs text-foreground font-medium">
                        Ready to connect with Rahul for daily commute?
                      </span>
                      <button
                        onClick={() => navigate('/register?role=seeker')}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-glow flex items-center justify-center gap-1 transition-all"
                      >
                        Create My Commute
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
