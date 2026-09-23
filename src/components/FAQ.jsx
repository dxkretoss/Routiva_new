import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'What is Routiva?',
    a: 'Routiva is a recurring daily commute matching platform designed specifically for office professionals and daily commuters in Ahmedabad and Gandhinagar. It connects vehicle owners (Riders) who have empty seats with commuters (Seekers) traveling along the same route.'
  },
  {
    q: 'Is Routiva a taxi or on-demand cab booking service?',
    a: 'No. Routiva is NOT a taxi service like Uber, Ola, or Rapido. You do not book on-demand rides every morning. Instead, you match once with a trusted commute partner and travel together every day, splitting fuel costs.'
  },
  {
    q: 'Can I join only for part of a Rider\'s route?',
    a: 'Yes, absolutely! That is the core innovation of Routiva. If the Rider travels Nikol → Thaltej and you only need Nikol → Vijay Cross Road, you are matched. You get dropped off at Vijay Cross Road while the Rider continues their journey to Thaltej.'
  },
  {
    q: 'Does the Rider need to have the exact same final destination as me?',
    a: 'No! The Rider does NOT need to go to your destination. As long as your destination lies sequentially along the Rider\'s route or near one of their preferred drop points, you can ride together.'
  },
  {
    q: 'Can I add multiple preferred pickup and drop locations?',
    a: 'Yes! Riders and Seekers can define up to 5 preferred pickup and drop locations near their route (e.g. Near Naroda Bridge, Memco BRTS, Airport Road Circle) to increase match opportunities.'
  },
  {
    q: 'Can I use Routiva if I don\'t own a vehicle?',
    a: 'Yes! Simply select "Seeker" during onboarding. You will be matched with vehicle owners whose daily routes pass your pickup point.'
  },
  {
    q: 'Can I be both a Rider and a Seeker?',
    a: 'Yes. If you drive some days and prefer to ride on other days, you can choose the "Both" role and create separate commutes.'
  },
  {
    q: 'How does the route matching algorithm work?',
    a: 'Our algorithm considers: (1) Full sequenced route overlap, (2) Sequential order (Drop point occurs after Pickup point), (3) Pickup & Drop proximity within tolerance radius, (4) Departure time within ±15 minutes flexibility, (5) Overlapping commute days, (6) Gender/profession preferences, and (7) Available seat capacity.'
  },
  {
    q: 'How are fuel contributions handled?',
    a: 'Commuters agree directly on a fair petrol split or fixed daily contribution (e.g., ₹40–₹60 per trip). Routiva does not take a cut per ride.'
  }
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="px-3.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider border border-border inline-block mb-3">
            Common Questions
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            Answers to What Everyone Asks
          </h2>
          <p className="text-muted-foreground text-base mt-3 font-medium">
            Everything you need to know about Routiva's route matching and daily commute model.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={item.q}
                className="bg-card border border-border rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base font-bold text-foreground leading-snug">
                    {item.q}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-secondary border border-border text-foreground transition-transform ${isOpen ? 'rotate-180 text-primary border-primary' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4 animate-fadeIn font-medium">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
