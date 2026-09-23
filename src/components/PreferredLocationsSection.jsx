import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function PreferredLocationsSection() {
  return (
    <section className="py-20 relative bg-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider border border-border inline-block mb-3">
            Flexible Proximity Matching
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            "Not Everyone Lives Directly on Your Route."
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mt-4 leading-relaxed font-medium">
            Routiva cleanly separates where you drive from where you are willing to stop. 
            This unlocks realistic matches without forcing riders out of their way.
          </p>
        </div>

        {/* Dual Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: Full Route */}
          <div className="bg-card border border-border rounded-3xl p-7 relative shadow-card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-secondary text-primary flex items-center justify-center font-bold">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Full Route Path</h3>
                <p className="text-xs text-primary font-bold">Where the Rider drives</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-medium">
              The exact sequence of roads and main transit arteries you take from origin to destination every morning.
            </p>

            <div className="bg-secondary/50 p-4 rounded-2xl border border-border space-y-2 text-xs">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Example:</span>
              <div className="text-foreground font-semibold leading-loose">
                <span className="text-primary font-bold">Nikol</span> → Naroda → Memco → Shahibaug → Income Tax → Vijay Cross Road → Gurukul → <span className="text-primary font-bold">Thaltej</span>
              </div>
            </div>
          </div>

          {/* Card 2: Preferred Pickup/Drop Points */}
          <div className="bg-card border-2 border-primary rounded-3xl p-7 relative shadow-glow">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-secondary text-orange-500 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Preferred Pickup & Drop Points</h3>
                <p className="text-xs text-orange-600 font-bold">Where you are comfortable stopping</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-medium">
              Safe, easily accessible landmarks, metro gates, or bus shelters where you can pull over for 30 seconds.
            </p>

            <div className="bg-secondary/50 p-4 rounded-2xl border border-border space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
                  Preferred Pickup Locations (Up to 5):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 rounded bg-card text-foreground font-semibold border border-border">Near Naroda Bridge</span>
                  <span className="px-2 py-1 rounded bg-card text-foreground font-semibold border border-border">Airport Road Circle</span>
                  <span className="px-2 py-1 rounded bg-card text-foreground font-semibold border border-border">Memco BRTS Gate</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block mb-1">
                  Preferred Drop Locations (Up to 5):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 rounded bg-card text-foreground font-semibold border border-border">Vijay Cross Road Bus Stop</span>
                  <span className="px-2 py-1 rounded bg-card text-foreground font-semibold border border-border">Gujarat University Gate</span>
                  <span className="px-2 py-1 rounded bg-card text-foreground font-semibold border border-border">Thaltej Metro Stn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
