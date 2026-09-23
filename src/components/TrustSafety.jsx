import React from 'react';
import { ShieldCheck, Lock, UserCheck, PhoneCall, AlertOctagon, Clock } from 'lucide-react';

export default function TrustSafety() {
  return (
    <section id="trust" className="py-20 relative bg-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider border border-border inline-block mb-3">
            Trust, Privacy & Safety
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            Built for Trusted Community Commutes
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mt-4 leading-relaxed font-medium">
            Your safety and privacy come first. We combine strict profile verification architectures, 
            encrypted communications, and community feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-secondary text-primary flex items-center justify-center mb-4 border border-border">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-bold text-foreground">Email & Phone OTP</h3>
              <span className="px-2 py-0.5 rounded text-[10px] bg-secondary text-primary font-bold border border-border">
                Available Now
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Every member verifies their email and mobile number before communicating or initiating connection requests.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-secondary text-primary flex items-center justify-center mb-4 border border-border">
              <Lock className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-bold text-foreground">Row Level Security (RLS)</h3>
              <span className="px-2 py-0.5 rounded text-[10px] bg-secondary text-primary font-bold border border-border">
                Available Now
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Strict database isolation. Your exact home address and contact details are shielded until a mutual connection request is accepted.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-secondary text-primary flex items-center justify-center mb-4 border border-border">
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-bold text-foreground">Govt ID & Driving License RC</h3>
              <span className="px-2 py-0.5 rounded text-[10px] bg-secondary text-secondary-foreground font-bold border border-border">
                Architecture Ready
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Aadhaar, Driving License, and Vehicle RC verification pipelines designed for automated KYC integration.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-secondary text-primary flex items-center justify-center mb-4 border border-border">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-bold text-foreground">Instant Report & Block</h3>
              <span className="px-2 py-0.5 rounded text-[10px] bg-secondary text-primary font-bold border border-border">
                Available Now
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Users can instantly report inappropriate behavior or block users to maintain a respectful, safe commuting environment.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-secondary text-primary flex items-center justify-center mb-4 border border-border">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-bold text-foreground">Corporate Badges</h3>
              <span className="px-2 py-0.5 rounded text-[10px] bg-secondary text-secondary-foreground font-bold border border-border">
                Coming Soon
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Connect with fellow commuters from GIFT City, Infocity, SG Highway IT parks with verified corporate work emails.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-secondary text-primary flex items-center justify-center mb-4 border border-border">
              <Clock className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-bold text-foreground">Live Route Sharing SOS</h3>
              <span className="px-2 py-0.5 rounded text-[10px] bg-secondary text-secondary-foreground font-bold border border-border">
                Coming Soon
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Share your daily commute status and estimated time of arrival with family members via SMS or WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
