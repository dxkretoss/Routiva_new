import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Route, 
  Menu, 
  X, 
  User, 
  Car, 
  Search, 
  LogOut, 
  Sparkles, 
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function Navbar() {
  const { user, profile, isAuthenticated, logoutUser, loginAsDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAuthPage = location.pathname.startsWith('/login') || 
                     location.pathname.startsWith('/register') || 
                     location.pathname.startsWith('/onboarding');

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border py-3.5 shadow-sm' 
          : 'bg-background/80 backdrop-blur-sm py-4 sm:py-5 border-b border-border/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 group">
            <img 
              src="/assets/images/routiva-logo-desktop.png" 
              alt="Routiva Logo" 
              className="h-8 md:h-9 w-auto object-contain hidden sm:block transition-transform group-hover:scale-105" 
            />
            <img 
              src="/assets/images/routiva-logo-mobile.png" 
              alt="Routiva Logo" 
              className="h-8 w-auto object-contain sm:hidden transition-transform group-hover:scale-105" 
            />
          </Link>

          {/* Desktop Navigation */}
          {!isAuthPage && (
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-[13px] xl:text-sm font-semibold text-muted-foreground whitespace-nowrap">
              <a href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
              <a href="/#full-route" className="hover:text-primary transition-colors flex items-center gap-1.5">
                Route Points
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-secondary text-secondary-foreground font-bold border border-border">
                  Unique
                </span>
              </a>
              <a href="/#riders" className="hover:text-foreground transition-colors">For Riders</a>
              <a href="/#seekers" className="hover:text-foreground transition-colors">For Seekers</a>
              <a href="/#interactive-demo" className="hover:text-foreground transition-colors">Demo</a>
              <a href="/#plans" className="hover:text-foreground transition-colors">Plans</a>
              <a href="/#faq" className="hover:text-foreground transition-colors">FAQ</a>
              <a href="/#contact" className="hover:text-foreground transition-colors">Contact</a>
            </nav>
          )}

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/dashboard"
                  className="px-3.5 py-2 text-xs xl:text-sm font-semibold text-foreground bg-card border border-border hover:border-primary rounded-xl transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                >
                  <Route className="w-4 h-4 text-primary" />
                  Dashboard
                </Link>

                <Link
                  to="/matches"
                  className="px-3.5 py-2 text-xs xl:text-sm font-bold text-primary-foreground bg-primary hover:bg-primary-hover rounded-xl shadow-glow transition-all flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" />
                  Find Matches
                </Link>

                <Link
                  to="/profile"
                  className="w-9 h-9 rounded-xl bg-card border border-border hover:border-primary p-0.5 flex items-center justify-center overflow-hidden transition-all shadow-sm"
                  title="My Profile"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <User className="w-4 h-4 text-foreground" />
                  )}
                </Link>

                <button
                  onClick={logoutUser}
                  className="p-2 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                {/* 1-Click Fast Demo Selectors */}
                <div className="hidden 2xl:flex items-center gap-1 bg-secondary border border-border rounded-xl p-1 text-xs text-secondary-foreground whitespace-nowrap">
                  <span className="px-2 font-semibold">Demo:</span>
                  <button
                    onClick={() => { loginAsDemo('rider'); navigate('/dashboard'); }}
                    className="px-2.5 py-1 rounded-lg bg-card hover:bg-primary hover:text-primary-foreground text-foreground transition-all font-semibold flex items-center gap-1 shadow-sm"
                  >
                    <Car className="w-3 h-3 text-primary" />
                    Rider
                  </button>
                  <button
                    onClick={() => { loginAsDemo('seeker'); navigate('/dashboard'); }}
                    className="px-2.5 py-1 rounded-lg bg-card hover:bg-primary hover:text-primary-foreground text-foreground transition-all font-semibold flex items-center gap-1 shadow-sm"
                  >
                    <Search className="w-3 h-3 text-orange-500" />
                    Seeker
                  </button>
                </div>

                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs xl:text-sm font-bold text-foreground hover:text-primary transition-all whitespace-nowrap"
                >
                  Log In
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 text-xs xl:text-sm font-bold text-primary-foreground bg-primary hover:bg-primary-hover rounded-xl shadow-glow transition-all flex items-center gap-1 whitespace-nowrap"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="p-2 text-primary bg-secondary rounded-lg border border-border"
              >
                <Route className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground bg-card border border-border rounded-xl shadow-sm"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-border px-4 pt-3 pb-6 mt-3 space-y-4 animate-fadeIn">
          <nav className="flex flex-col gap-2 text-base font-semibold text-foreground">
            <a 
              href="/#how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-secondary"
            >
              How It Works
            </a>
            <a 
              href="/#full-route" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-secondary text-primary flex items-center justify-between"
            >
              <span>Full Route Feature</span>
              <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-bold">Unique</span>
            </a>
            <a 
              href="/#riders" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-secondary"
            >
              For Riders
            </a>
            <a 
              href="/#seekers" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-secondary"
            >
              For Seekers
            </a>
            <a 
              href="/#interactive-demo" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-secondary"
            >
              Interactive Route Demo
            </a>
            <a 
              href="/#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-secondary"
            >
              FAQ
            </a>
          </nav>

          <div className="pt-3 border-t border-border flex flex-col gap-2.5">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center font-bold text-primary-foreground bg-primary rounded-xl"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => { logoutUser(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center font-semibold text-rose-600 bg-rose-50 rounded-xl"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center font-bold text-primary-foreground bg-primary rounded-xl shadow-glow"
                >
                  Create Account (Email OTP)
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-bold text-foreground bg-card border border-border rounded-xl"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
