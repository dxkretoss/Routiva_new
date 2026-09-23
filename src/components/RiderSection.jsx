import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RiderSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleOfferRide = () => {
    if (isAuthenticated) {
      navigate('/create-commute');
    } else {
      navigate('/register?role=rider');
    }
  };

  return (
    <section id="riders" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border-2 border-primary/40 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-glow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider border border-border inline-block">
                For Vehicle Owners
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
                Already Driving? Turn Your Empty Seat Into a Shared Commute.
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-medium">
                You already make this trip every morning. Share your available seats with a verified office commuter 
                traveling along your route, split petrol costs, and build a lasting commute connection.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground font-medium">
                  <div className="p-1 rounded-full bg-secondary text-primary mt-0.5 border border-border">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Recover ₹3,000–₹5,000 in monthly petrol</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground font-medium">
                  <div className="p-1 rounded-full bg-secondary text-primary mt-0.5 border border-border">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>You choose your preferred pickup/drop points</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground font-medium">
                  <div className="p-1 rounded-full bg-secondary text-primary mt-0.5 border border-border">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Ride with the same verified partner daily</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground font-medium">
                  <div className="p-1 rounded-full bg-secondary text-primary mt-0.5 border border-border">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Zero detours — drop them right along your way</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleOfferRide}
                  className="px-7 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm shadow-glow flex items-center gap-2 transition-all transform active:scale-95"
                >
                  <Car className="w-4 h-4" />
                  Offer a Ride
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-secondary/50 border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border text-xs text-muted-foreground font-semibold">
                <span>Rider Monthly Savings Example</span>
                <span className="text-primary font-bold">Ahmedabad ↔ Gandhinagar</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Solo Monthly Fuel Cost:</span>
                  <span className="font-semibold text-rose-600">₹7,200</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>2 Shared Commute Buddies:</span>
                  <span className="font-semibold text-emerald-600">+ ₹4,800/mo</span>
                </div>
                <div className="p-3.5 rounded-xl bg-card border border-border flex justify-between items-center text-foreground font-bold shadow-sm">
                  <span>Your Net Monthly Fuel Spend:</span>
                  <span className="text-base text-primary font-black">₹2,400</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
