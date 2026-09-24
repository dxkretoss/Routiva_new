import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight,
  Server,
  Activity,
  Database,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { invokeEdgeFunction } from '../lib/edgeFunctions';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await invokeEdgeFunction('admin-login', {
        email: email.trim(),
        password
      });

      if (res.success && res.token) {
        const sessionPayload = {
          token: res.token,
          role: res.role || 'super_admin',
          email: res.user?.email || email.trim(),
          authenticated_at: new Date().toISOString()
        };
        localStorage.setItem('routiva_admin_auth', JSON.stringify(sessionPayload));
        sessionStorage.setItem('routiva_admin_auth', JSON.stringify(sessionPayload));
        onLoginSuccess();
      } else {
        setError(res.error || 'Invalid administrative credentials.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground grid grid-cols-1 lg:grid-cols-12">
      {/* LEFT SIDE: Admin Infrastructure & Security Telemetry (Desktop) */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-gradient-to-b from-secondary/80 via-secondary/40 to-background border-r border-border p-8 xl:p-12 flex-col justify-between sticky top-0 h-screen overflow-hidden">
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
        <div className="my-auto py-6 relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-secondary-foreground text-xs font-bold shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Administrative Command Portal</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black text-foreground tracking-tight leading-tight">
            Routiva Operations & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
              Corridor Governance
            </span>
          </h1>

          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed font-medium">
            Centralized administration system for Ahmedabad & Gandhinagar commuter verification, real-time matching algorithms, and infrastructure observability.
          </p>

          {/* Infrastructure Metrics Card */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-foreground">Cluster Status: Healthy</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                100% Operational
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-secondary/50 border border-border">
                <span className="flex items-center gap-2 text-muted-foreground font-semibold">
                  <Activity className="w-3.5 h-3.5 text-primary" /> Matching Engine
                </span>
                <span className="font-bold text-foreground">Sub-50ms Latency</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-secondary/50 border border-border">
                <span className="flex items-center gap-2 text-muted-foreground font-semibold">
                  <Server className="w-3.5 h-3.5 text-primary" /> Edge Functions
                </span>
                <span className="font-bold text-foreground">11 Micro-services Active</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-secondary/50 border border-border">
                <span className="flex items-center gap-2 text-muted-foreground font-semibold">
                  <Lock className="w-3.5 h-3.5 text-primary" /> Security Layer
                </span>
                <span className="font-bold text-foreground">Role-Based Access Control</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Security Info */}
        <div className="pt-4 border-t border-border/80 flex items-center justify-between text-xs text-muted-foreground font-medium relative z-10">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-primary" />
            256-Bit SSL Encrypted Session
          </span>
          <span className="font-bold text-foreground">Admin v1.0</span>
        </div>
      </div>

      {/* RIGHT SIDE: Admin Authentication Form */}
      <div className="col-span-12 lg:col-span-7 xl:col-span-7 flex flex-col justify-center items-center px-4 sm:px-8 xl:px-14 py-12 relative min-h-screen">
        {/* Mobile Header Logo */}
        <div className="lg:hidden text-center mb-8 w-full">
          <Link to="/" className="inline-block group">
            <img 
              src="/assets/images/routiva-logo-desktop.png" 
              alt="Routiva Logo" 
              className="h-8 w-auto object-contain mx-auto transition-transform group-hover:scale-105" 
            />
          </Link>
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="text-center sm:text-left space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border border-border text-secondary-foreground text-[11px] font-bold shadow-xs mb-1">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>Super Admin Authentication</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Admin Control Center
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              Enter your administrative credentials to access platform controls
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card space-y-5">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 animate-fadeIn flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0"></span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Admin Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter admin email..."
                    className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-bold text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Master Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-10 py-2.5 text-xs font-bold text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
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
                <ShieldCheck className="w-4 h-4" />
                {loading ? 'Verifying Super Admin Authorization...' : 'Authenticate & Enter Dashboard'}
              </button>
            </form>

            <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <Link to="/" className="text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1 transition-colors">
                ← Back to Platform
              </Link>
              <span className="text-[10px] text-muted-foreground/80 font-medium">
                Authorized Personnel Only
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
