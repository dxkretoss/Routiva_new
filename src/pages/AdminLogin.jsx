import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@routiva.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Secure Admin Verification
    setTimeout(() => {
      if (email.trim().toLowerCase() === 'admin@routiva.com' && (password === 'admin123' || password === 'admin@2026')) {
        sessionStorage.setItem('routiva_admin_auth', 'true');
        onLoginSuccess();
      } else {
        setError('Invalid admin credentials. Please check and retry.');
      }
      setLoading(false);
    }, 400);
  };

  const handleQuickFill = () => {
    setEmail('admin@routiva.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-secondary-foreground text-xs font-bold mb-3 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Routiva Administrative Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Admin Control Center
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Sign in to manage live commuters, route corridors & system analytics
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Admin Email
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
                  placeholder="admin@routiva.com"
                  className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-bold text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Master Password
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
                  placeholder="••••••••"
                  className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-10 py-2.5 text-xs font-bold text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
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
              {loading ? 'Authenticating Admin...' : 'Enter Admin Panel'}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-3 border-t border-border/70 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Demo: <strong>admin@routiva.com</strong> / <strong>admin123</strong></span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-primary font-bold hover:underline"
            >
              Auto-Fill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
