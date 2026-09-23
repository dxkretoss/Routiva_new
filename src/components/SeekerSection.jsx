import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SeekerSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleFindRide = () => {
    if (isAuthenticated) {
      navigate('/matches');
    } else {
      navigate('/register?role=seeker');
    }
  };

  return (
    <section id="seekers" className="py-20 relative bg-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border-2 border-border rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider border border-border inline-block">
                For Daily Seekers
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
                Need a Daily Ride? Skip the Morning Cab Scramble.
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-medium">
                Instead of searching for unpredictable cabs every morning, set your daily commute route once. 
                Routiva pairs you with verified drivers driving past your pickup point every single day.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground font-medium">
                  <div className="p-1 rounded-full bg-secondary text-primary mt-0.5 border border-border">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Pay 60–70% less than daily cab surge fares</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground font-medium">
                  <div className="p-1 rounded-full bg-secondary text-primary mt-0.5 border border-border">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Fixed scheduled pickup — zero driver cancellations</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground font-medium">
                  <div className="p-1 rounded-full bg-secondary text-primary mt-0.5 border border-border">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Comfortable AC car rides with corporate peers</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground font-medium">
                  <div className="p-1 rounded-full bg-secondary text-primary mt-0.5 border border-border">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Join for the exact segment you need</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleFindRide}
                  className="px-7 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm shadow-glow flex items-center gap-2 transition-all transform active:scale-95"
                >
                  <Search className="w-4 h-4 text-primary-foreground" />
                  Find a Ride
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-secondary/50 border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border text-xs text-muted-foreground font-semibold">
                <span>Daily Cab vs Routiva Comparison</span>
                <span className="text-primary font-bold">22 Working Days</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Daily Cab/Auto Fares (₹250/day):</span>
                  <span className="font-semibold text-rose-600">₹5,500/mo</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Routiva Shared Commute (₹55/day):</span>
                  <span className="font-semibold text-emerald-600">₹1,210/mo</span>
                </div>
                <div className="p-3.5 rounded-xl bg-card border border-border flex justify-between items-center text-foreground font-bold shadow-sm">
                  <span>Monthly Wallet Savings:</span>
                  <span className="text-base text-primary font-black">Save ₹4,290 / mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
