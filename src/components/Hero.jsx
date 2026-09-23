import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Route, 
  ArrowRight, 
  Car, 
  Search, 
  ShieldCheck, 
  TrendingDown, 
  Users,
  Sparkles
} from 'lucide-react';
import HeroRouteVisualizer from './HeroRouteVisualizer';
import { useAuth } from '../context/AuthContext';

export default function Hero() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleStartAs = (role) => {
    if (isAuthenticated) {
      navigate('/create-commute');
    } else {
      navigate(`/register?role=${role}`);
    }
  };

  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Soft warm ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-14">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary border border-border text-secondary-foreground text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping"></span>
            <span>Routiva • Recurring Daily-Commute Matcher</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-foreground font-bold">Ahmedabad ↔ Gandhinagar</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.12] mb-6">
            Your Daily Route. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-amber-600">
              Your Ride Partner.
            </span>
          </h1>

          {/* Supporting Pitch */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto font-medium">
            Routiva connects people traveling the same way every day — helping riders share their available seats and helping seekers find a reliable daily commute.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
            <button
              onClick={() => handleStartAs('seeker')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-base shadow-glow flex items-center justify-center gap-2 transform active:scale-95 transition-all"
            >
              <Search className="w-5 h-5" />
              Find My Ride
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleStartAs('rider')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-card border border-border hover:border-primary text-foreground font-bold text-base shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all"
            >
              <Car className="w-5 h-5 text-primary" />
              Offer a Ride
            </button>

            <a
              href="#interactive-demo"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl text-muted-foreground hover:text-foreground text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              See How It Works
            </a>
          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-card border border-border rounded-2xl p-3.5 shadow-sm">
              <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                <Route className="w-3.5 h-3.5 text-primary" />
                Matching
              </div>
              <div className="text-sm font-bold text-foreground mt-0.5">Full Route Points</div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-3.5 shadow-sm">
              <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-primary" />
                Cost Savings
              </div>
              <div className="text-sm font-bold text-foreground mt-0.5">Save 60% Monthly</div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-3.5 shadow-sm">
              <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                Commute Model
              </div>
              <div className="text-sm font-bold text-foreground mt-0.5">1 Match → Daily Buddy</div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-3.5 shadow-sm">
              <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Safety
              </div>
              <div className="text-sm font-bold text-foreground mt-0.5">Verified Profiles</div>
            </div>
          </div>
        </div>

        {/* Live Interactive Hero Route Visualizer */}
        <div className="max-w-4xl mx-auto">
          <HeroRouteVisualizer />
        </div>
      </div>
    </section>
  );
}
