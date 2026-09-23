import React from 'react';
import { 
  UserCheck, 
  ToggleLeft, 
  MapPin, 
  Navigation, 
  Sparkles, 
  MessageSquare
} from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Create Your Profile & Verify Email OTP',
    desc: 'Enter your name, profession, city, and verify your email with a secure 6-digit OTP code.',
    icon: UserCheck,
    tag: 'Quick & Secure'
  },
  {
    step: '02',
    title: 'Choose Your Commute Role',
    desc: 'Select whether you are a Rider (offering empty vehicle seats), a Seeker (looking for a ride), or Both.',
    icon: ToggleLeft,
    tag: 'Flexible'
  },
  {
    step: '03',
    title: 'Add Your Origin, Destination & Route',
    desc: 'Specify your daily departure time, schedule, and all intermediate transit hubs you pass through.',
    icon: Navigation,
    tag: 'Full Route Sequence'
  },
  {
    step: '04',
    title: 'Set Preferred Pickup & Drop Points',
    desc: 'Define convenient landmarks or cross-roads near your route where you feel comfortable picking up or dropping buddies.',
    icon: MapPin,
    tag: 'Proximity Matching'
  },
  {
    step: '05',
    title: 'Routiva Finds Compatible Route Matches',
    desc: 'Our engine evaluates route overlap, sequence order (drop after pickup), time flexibility, and seat capacity.',
    icon: Sparkles,
    tag: 'Smart Algorithm'
  },
  {
    step: '06',
    title: 'Connect, Coordinate & Commute Daily',
    desc: 'Send a connection request. Once accepted, coordinate via in-app chat and travel together every day!',
    icon: MessageSquare,
    tag: 'Daily Partner'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 relative bg-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider border border-border inline-block mb-3">
            Simple 6-Step Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            From Lonely Commute to Daily Route Buddy
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mt-4 leading-relaxed font-medium">
            Here is the exact step-by-step journey of finding your ideal daily ride partner on Routiva.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.step}
                className="bg-card border border-border hover:border-primary rounded-3xl p-6 transition-all hover:-translate-y-1 relative group shadow-card"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-secondary text-primary flex items-center justify-center border border-border group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-muted-foreground/40 group-hover:text-primary transition-colors font-mono">
                    {step.step}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-secondary px-2.5 py-0.5 rounded-full border border-border">
                    {step.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
