import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Route,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Sparkles,
  Car,
  Search,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function Login() {
  const navigate = useNavigate();
  const { loginUser, loginAsDemo } = useAuth();
  const { addToast } = useNotifications();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please provide your email and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(email, password);
      if (res.success) {
        addToast('Welcome back to Routiva!', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      addToast(err.message || 'Login failed. Check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = (role) => {
    loginAsDemo(role);
    addToast(`Logged in as Demo ${role === 'rider' ? 'Rider (Rahul)' : 'Seeker (Ananya)'}`, 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background text-foreground grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
      {/* LEFT SIDE: Platform Graphic & Commute Showcase (Desktop) */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-gradient-to-b from-secondary/80 via-secondary/40 to-background border-r border-border p-8 xl:p-12 flex-col justify-between relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/15 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-orange-400/15 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Top Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-block group">
            <img
              src="/assets/images/routiva-logo-desktop.png"
              alt="Routiva Logo"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Center Showcase Content */}
        <div className="my-auto py-8 relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-secondary-foreground text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Welcome Back Commuter</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black text-foreground tracking-tight leading-tight">
            Your daily route buddy is <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
              ready to travel.
            </span>
          </h1>

          <p className="text-muted-foreground text-sm leading-relaxed font-medium">
            Sign in to check live compatible commute matches, review pending requests, and manage shared petrol splits.
          </p>

          {/* Floating Commute Preview Card */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-foreground">Active Daily Route</span>
              </div>
              <span className="text-[11px] font-bold text-primary bg-secondary px-2.5 py-0.5 rounded-full border border-border">
                Mon - Fri Regular
              </span>
            </div>

            <div className="p-3 rounded-xl bg-secondary/50 border border-border space-y-1.5 text-xs font-semibold">
              <div className="flex items-center justify-between text-foreground">
                <span className="font-bold">Nikol ➔ Thaltej (via Vijay Cross Rd)</span>
                <span className="text-primary font-bold">8:30 AM</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium">
                Recurring route with 2 matched verified companions
              </p>
            </div>
          </div>

          {/* Benefit Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-border text-xs font-semibold text-foreground shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero Surge Pricing</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-border text-xs font-semibold text-foreground shadow-sm">
              <KeyRound className="w-4 h-4 text-primary shrink-0" />
              <span>Predictable Daily Buddy</span>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10 pt-4 border-t border-border/70 flex items-center justify-between text-xs text-muted-foreground font-medium">
          <span>Ahmedabad ↔ Gandhinagar Corridor</span>
          <span className="text-primary font-bold">Routiva Community</span>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="col-span-12 lg:col-span-7 xl:col-span-7 flex flex-col justify-center items-center px-4 sm:px-8 xl:px-16 py-10 sm:py-14 relative overflow-y-auto">
        <div className="w-full max-w-xl">
          {/* Mobile Logo View */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-block group">
              <img
                src="/assets/images/routiva-logo-desktop.png"
                alt="Routiva Logo"
                className="h-8 w-auto object-contain mx-auto"
              />
            </Link>
          </div>

          <div className="text-left mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Sign In to Your Commute
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 font-medium">
              Access your active route, live matches and connected daily ride buddies
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card space-y-5">
            {/* 1-Click Instant Demo Login Option */}
            <div className="bg-secondary/50 p-4 rounded-2xl border border-border">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Instant 1-Click Demo Access
                </span>
                <span className="text-[10px] text-primary font-bold bg-card px-2 py-0.5 rounded border border-border shadow-sm">
                  Pre-configured
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemo('rider')}
                  className="py-2.5 px-3 rounded-xl bg-card border border-border hover:border-primary text-xs font-bold text-foreground hover:text-primary flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Car className="w-3.5 h-3.5 text-primary" />
                  Rahul (Rider)
                </button>
                <button
                  type="button"
                  onClick={() => handleDemo('seeker')}
                  className="py-2.5 px-3 rounded-xl bg-card border border-border hover:border-primary text-xs font-bold text-foreground hover:text-orange-600 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Search className="w-3.5 h-3.5 text-orange-500" />
                  Ananya (Seeker)
                </button>
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-xs text-muted-foreground font-semibold">or continue with password</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-bold text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-10 py-2.5 text-xs font-bold text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
              >
                <LogIn className="w-4 h-4" />
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground font-medium">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-primary hover:underline font-bold ml-1">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
