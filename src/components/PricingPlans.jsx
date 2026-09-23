import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';

const PLANS = [
  {
    name: 'Start Free',
    price: '₹0',
    period: 'Forever free',
    desc: 'Perfect for individual daily commuters getting started.',
    features: [
      '1 active daily commute route',
      'Basic route sequence matching',
      'Community trust verification',
      'In-app direct connection requests',
      'Standard customer support'
    ],
    cta: 'Start Free',
    highlighted: false
  },
  {
    name: 'Go Commuter',
    price: '₹199',
    period: 'per month',
    desc: 'Enhanced matching and verified member badges for frequent commuters.',
    features: [
      'Unlimited daily routes (office & weekend)',
      'Priority route matching algorithm',
      'Verified Commuter Gold Badge',
      'Unlimited in-app chat & coordination',
      'Flexible departure time alerts',
      'WhatsApp commute update reminders'
    ],
    cta: 'Go Commuter',
    highlighted: true,
    badge: 'Most Popular'
  },
  {
    name: 'Rider Pro',
    price: '₹349',
    period: 'per month',
    desc: 'For regular vehicle owners sharing multiple seats daily.',
    features: [
      'Everything in Commuter',
      'Multiple morning & evening time slots',
      'Auto-rematch if a partner takes leave',
      'Smart Fuel Contribution Dashboard',
      'VIP Priority Support & Insurance add-on',
      'Zero platform transaction fee'
    ],
    cta: 'Upgrade Pro',
    highlighted: false
  }
];

export default function PricingPlans() {
  return (
    <section id="plans" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider border border-border inline-block mb-3">
            Simple Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            Simple Pricing. Big Savings.
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mt-4 leading-relaxed font-medium">
            We don't take hefty commissions per ride. Commuters agree directly on petrol contribution. 
            Select a plan that fits your commute frequency.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
                plan.highlighted
                  ? 'bg-card border-2 border-primary shadow-glow scale-105 z-10'
                  : 'bg-card border border-border hover:border-slate-300 shadow-card'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-extrabold text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                </div>

                <div className="mb-4">
                  <span className="text-4xl font-black text-foreground tracking-tight">{plan.price}</span>
                  <span className="text-xs text-muted-foreground ml-1.5 font-semibold">{plan.period}</span>
                </div>

                <p className="text-xs text-muted-foreground mb-6 leading-relaxed font-medium">
                  {plan.desc}
                </p>

                <div className="border-t border-border pt-6 mb-6 space-y-3 text-xs sm:text-sm text-foreground">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5">
                      <div className="p-0.5 rounded-full bg-secondary text-primary mt-0.5 border border-border">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/register"
                className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm text-center transition-all ${
                  plan.highlighted
                    ? 'bg-primary hover:bg-primary-hover text-primary-foreground shadow-glow'
                    : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
