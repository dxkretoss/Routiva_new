import React from 'react';
import { TrendingUp, AlertTriangle, Car, User } from 'lucide-react';

export default function ProblemSection() {
  return (
    <section className="py-20 relative bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider border border-border inline-block mb-3">
            The Commuter Dilemma
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            Daily Travel Shouldn't Be a Daily Problem.
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mt-4 leading-relaxed font-medium">
            Thousands of commuters in Ahmedabad & Gandhinagar travel the exact same roads at the exact same hour every morning. 
            Yet riders drive with empty seats while seekers struggle with daily ride apps.
          </p>
        </div>

        {/* Two Commuter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Card 1: The Rider */}
          <div className="bg-card border border-border hover:border-primary rounded-3xl p-7 transition-all flex flex-col justify-between group shadow-card">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-secondary text-primary flex items-center justify-center font-bold mb-6 border border-border group-hover:scale-105 transition-transform shadow-sm">
                <Car className="w-7 h-7 text-primary" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Vehicle Owner</span>
                <span className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> ₹6,000+ Petrol/Mo
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                "I already travel this route every single day."
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-medium">
                Driving alone every morning, absorbing 100% of rising petrol costs, servicing, tolls, and parking expenses with 3 empty seats in the car.
              </p>

              <ul className="space-y-2.5 text-xs text-muted-foreground font-semibold">
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">✕</span> High fuel bills on fixed daily commutes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">✕</span> Empty seats going to waste every day
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">✕</span> Lonely, stressful drive in peak traffic
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-5 border-t border-border flex items-center justify-between">
              <span className="text-xs text-primary font-bold">Routiva Solution:</span>
              <span className="text-xs text-foreground font-semibold bg-secondary px-3 py-1.5 rounded-xl border border-border">
                Recover 60% fuel cost with a verified buddy
              </span>
            </div>
          </div>

          {/* Card 2: The Seeker */}
          <div className="bg-card border border-border hover:border-primary rounded-3xl p-7 transition-all flex flex-col justify-between group shadow-card">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-secondary text-primary flex items-center justify-center font-bold mb-6 border border-border group-hover:scale-105 transition-transform shadow-sm">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Daily Commuter</span>
                <span className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> 2x Surge Pricing
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                "I need a reliable ride along this route."
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-medium">
                Spending 30 minutes every morning waiting for cab drivers, dealing with peak surge charges, last-minute cancellations, and unpredictable daily costs.
              </p>

              <ul className="space-y-2.5 text-xs text-muted-foreground font-semibold">
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">✕</span> Unpredictable 2x to 3x surge fares
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">✕</span> Driver cancellations right before work
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">✕</span> Booking afresh every single morning
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-5 border-t border-border flex items-center justify-between">
              <span className="text-xs text-primary font-bold">Routiva Solution:</span>
              <span className="text-xs text-foreground font-semibold bg-secondary px-3 py-1.5 rounded-xl border border-border">
                Fixed reliable commute with the same trusted partner
              </span>
            </div>
          </div>
        </div>

        {/* The Connection Formula */}
        <div className="mt-12 max-w-2xl mx-auto glass-panel-glow rounded-2xl p-4 text-center flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-bold text-foreground">
          <span className="px-3 py-1 rounded-lg bg-secondary text-secondary-foreground border border-border">Rider (Empty Seat)</span>
          <span className="text-primary text-lg">+</span>
          <span className="px-3 py-1 rounded-lg bg-secondary text-secondary-foreground border border-border">Seeker (Shared Route)</span>
          <span className="text-primary text-lg">=</span>
          <span className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground font-extrabold shadow-glow">
            ROUTIVA (1 Match → Months of Peace)
          </span>
        </div>
      </div>
    </section>
  );
}
