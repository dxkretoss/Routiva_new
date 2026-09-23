import React from 'react';
import { Link } from 'react-router-dom';
import { Route } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-12 text-muted-foreground text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src="/assets/images/routiva-logo-desktop.png" 
                alt="Routiva Logo" 
                className="h-8 w-auto object-contain" 
              />
            </Link>
            <p className="text-muted-foreground text-xs leading-relaxed font-medium">
              The daily commute matchmaker. Share the ride, split the cost, meet your route buddy.
            </p>
            <div className="text-[11px] text-primary font-bold">
              Made for Ahmedabad & Gandhinagar Commuters
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-bold text-foreground uppercase text-[11px] tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 font-medium">
              <li><a href="/#how-it-works" className="hover:text-foreground transition-colors">How it works</a></li>
              <li><a href="/#full-route" className="hover:text-foreground transition-colors">Route points</a></li>
              <li><a href="/#riders" className="hover:text-foreground transition-colors">For Riders</a></li>
              <li><a href="/#seekers" className="hover:text-foreground transition-colors">For Seekers</a></li>
              <li><a href="/#plans" className="hover:text-foreground transition-colors">Plans</a></li>
              <li><a href="/#faq" className="hover:text-foreground transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Col 3: Product Links */}
          <div>
            <h4 className="font-bold text-foreground uppercase text-[11px] tracking-wider mb-3">Commute App</h4>
            <ul className="space-y-2 font-medium">
              <li><Link to="/register" className="hover:text-foreground transition-colors">Create Account (Email OTP)</Link></li>
              <li><Link to="/login" className="hover:text-foreground transition-colors">Commuter Login</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Commute Dashboard</Link></li>
              <li><Link to="/matches" className="hover:text-foreground transition-colors">Live Route Matches</Link></li>
            </ul>
          </div>

          {/* Col 4: Company & Legal */}
          <div>
            <h4 className="font-bold text-foreground uppercase text-[11px] tracking-wider mb-3">Company</h4>
            <ul className="space-y-2 font-medium">
              <li><a href="/#trust" className="hover:text-foreground transition-colors">Trust & Guidelines</a></li>
              <li><a href="/#contact" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground font-medium">
          © {new Date().getFullYear()} Routiva. Built for daily commuters.
        </div>
      </div>
    </footer>
  );
}
