import React from 'react';
import { Sparkles, Car } from 'lucide-react';

export default function DifferentSection() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider border border-border inline-block mb-3">
            Product Differentiation
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            How Routiva Reinvents Daily Commutes
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mt-4 leading-relaxed font-medium">
            We are not a taxi app or an on-demand cab aggregator. Routiva is designed from the ground up for 
            predictable, community-powered recurring travel.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional Ride Apps */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 relative shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="w-10 h-10 rounded-xl bg-secondary text-muted-foreground flex items-center justify-center font-bold shadow-sm">
                <Car className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Traditional Ride Booking</h3>
                <p className="text-xs text-muted-foreground">Per-trip taxi & cab aggregators</p>
              </div>
            </div>

            {/* Loop Box */}
            <div className="p-4 rounded-2xl bg-secondary border border-border mb-6 text-xs text-muted-foreground flex items-center justify-between font-mono font-semibold">
              <span>Book Cab</span>
              <span>→</span>
              <span>Pay Surge</span>
              <span>→</span>
              <span>Ride with Stranger</span>
              <span>→</span>
              <span className="text-rose-600 font-bold">Repeat Daily</span>
            </div>

            <ul className="space-y-4 text-sm text-foreground">
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <div>
                  <strong className="text-foreground block">One-Off Trips Only:</strong>
                  <span className="text-muted-foreground text-xs font-medium">You must re-book and pray for a driver every single morning.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <div>
                  <strong className="text-foreground block">Surge Pricing Volatility:</strong>
                  <span className="text-muted-foreground text-xs font-medium">Pay double on rainy days, peak office rush, or festive seasons.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <div>
                  <strong className="text-foreground block">Random Strangers Each Trip:</strong>
                  <span className="text-muted-foreground text-xs font-medium">Never know who the driver is or their driving habits.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Routiva Recurring Commute */}
          <div className="bg-card border-2 border-primary rounded-3xl p-6 sm:p-8 relative shadow-glow">
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold border border-border uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" />
                The Routiva Way
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold shadow-sm">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Routiva Route Partnering</h3>
                <p className="text-xs text-primary font-bold">One match → Ongoing recurring commute</p>
              </div>
            </div>

            {/* Linear Connect Box */}
            <div className="p-4 rounded-2xl bg-orange-50 border border-primary/30 mb-6 text-xs text-foreground flex items-center justify-between font-mono font-semibold">
              <span>Enter Route</span>
              <span>→</span>
              <span>Find Partner</span>
              <span>→</span>
              <span>Connect Once</span>
              <span>→</span>
              <span className="text-primary-foreground font-bold bg-primary px-2.5 py-0.5 rounded shadow-sm">Ride Daily</span>
            </div>

            <ul className="space-y-4 text-sm text-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-0.5">✓</span>
                <div>
                  <strong className="text-foreground block">Recurring Commute Partner:</strong>
                  <span className="text-muted-foreground text-xs font-medium">Match once with a colleague or neighbour traveling your way.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-0.5">✓</span>
                <div>
                  <strong className="text-foreground block">Fair Cost Sharing:</strong>
                  <span className="text-muted-foreground text-xs font-medium">Transparent petrol split without exploitative platform cuts.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-0.5">✓</span>
                <div>
                  <strong className="text-foreground block">Same Trusted Face Every Day:</strong>
                  <span className="text-muted-foreground text-xs font-medium">Verified office professionals, scheduled pickup, and comfortable rides.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
