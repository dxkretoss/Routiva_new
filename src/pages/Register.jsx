import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Route,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  CheckCircle2,
  Car,
  Search,
  User,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'rider';
  const navigate = useNavigate();
  const { registerUser, verifyOtp, resendOtp } = useAuth();
  const { addToast } = useNotifications();

  // Step 1: Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '+91',
    password: '',
    confirmPassword: '',
    role: initialRole
  });

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2: OTP State
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [debugOtp, setDebugOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (isOtpStep && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpStep, resendTimer]);

  // Handle Step 1: Registration Form Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email || !formData.phone || !formData.password) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }
    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(formData.email, formData.phone, formData.password, formData.fullName);
      if (res.success) {
        setIsOtpStep(true);
        setDebugOtp(res.debugOtp || '');
        setResendTimer(60);
        addToast('Verification OTP sent to your email address!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2: OTP Verification Submit
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      addToast('Please enter the complete 6-digit OTP code.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(formData.email, otpCode, formData.phone, formData.password, formData.fullName);
      if (res.success) {
        addToast('Email verified successfully! Welcome to Routiva.', 'success');
        navigate(`/onboarding?role=${formData.role}`);
      }
    } catch (err) {
      addToast(err.message || 'Invalid or expired OTP code.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      const res = await resendOtp(formData.email);
      if (res.success) {
        setDebugOtp(res.debugOtp || '');
        setResendTimer(60);
        addToast('A new 6-digit OTP has been sent to your email.', 'info');
      }
    } catch (err) {
      addToast(err.message || 'Failed to resend OTP.', 'error');
    }
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
            <span>Recurring Daily-Commute Network</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black text-foreground tracking-tight leading-tight">
            Same route doesn't mean <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
              same destination.
            </span>
          </h1>

          <p className="text-muted-foreground text-sm leading-relaxed font-medium">
            Routiva pairs vehicle owners with daily commuters traveling along intermediate route points across Ahmedabad & Gandhinagar.
          </p>

          {/* Floating Route Card */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-foreground">Live Route Matcher</span>
              </div>
              <span className="text-[11px] font-bold text-primary bg-secondary px-2.5 py-0.5 rounded-full border border-border">
                98% Route Match
              </span>
            </div>

            {/* Visual Route Track */}
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/50 border border-border">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-primary" />
                  <div>
                    <span className="text-foreground font-bold block">Rider: Nikol → Thaltej</span>
                    <span className="text-[10px] text-muted-foreground font-medium">Leaves at 8:30 AM • 2 Seats Available</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/60 border border-primary/30">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <div>
                    <span className="text-foreground font-bold block">Seeker: Nikol → Vijay Cross Rd</span>
                    <span className="text-[10px] text-primary font-bold">Matches on Intermediate Segment</span>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              </div>
            </div>
          </div>

          {/* Benefit Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-border text-xs font-semibold text-foreground shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified IDs & OTP</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-border text-xs font-semibold text-foreground shadow-sm">
              <KeyRound className="w-4 h-4 text-primary shrink-0" />
              <span>Save 60% Monthly Fuel</span>
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
              {isOtpStep ? 'Verify Your Email OTP' : 'Create Your Account'}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 font-medium">
              {isOtpStep
                ? `Enter the 6-digit code sent to ${formData.email}`
                : 'Join daily commuters traveling on your exact route & schedule.'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card">
            {!isOtpStep ? (
              /* STEP 1: REGISTRATION FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Role Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    I am primarily a:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'rider' })}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${formData.role === 'rider'
                        ? 'bg-secondary border-primary text-primary shadow-sm'
                        : 'bg-card border-border text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      <Car className="w-4 h-4 text-primary" />
                      Rider (Has Vehicle)
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'seeker' })}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${formData.role === 'seeker'
                        ? 'bg-secondary border-primary text-orange-600 shadow-sm'
                        : 'bg-card border-border text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      <Search className="w-4 h-4 text-orange-500" />
                      Seeker (Needs Ride)
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-bold text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Corporate / Personal Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-bold text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Mobile Number with Country Code */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Mobile Number (WhatsApp) *
                  </label>
                  <div className="phone-input-container">
                    <PhoneInput
                      country={'in'}
                      value={formData.phone}
                      onChange={(phone) => {
                        const formatted = phone ? (phone.startsWith('+') ? phone : `+${phone}`) : '+91';
                        setFormData({ ...formData, phone: formatted });
                      }}
                      enableSearch={true}
                      disableSearchIcon={true}
                      searchPlaceholder="Search country..."
                      inputProps={{
                        name: 'phone',
                        required: true,
                        placeholder: 'Enter mobile number'
                      }}
                    />
                  </div>
                </div>

                {/* Password & Confirm Password (1 row 2 columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="At least 6 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-10 py-2.5 text-xs font-bold text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  {loading ? 'Sending Verification OTP...' : 'Continue to Email OTP Verification'}
                </button>
              </form>
            ) : (
              /* STEP 2: EMAIL OTP VERIFICATION SCREEN */
              <form onSubmit={handleOtpVerify} className="space-y-5 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-orange-50 border border-primary/30 text-xs text-foreground flex items-start gap-2.5 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Verification Code Sent!</span>
                    <span className="font-medium text-muted-foreground">We've generated a 6-digit code for <strong>{formData.email}</strong></span>
                  </div>
                </div>

                {debugOtp && (
                  <div className="p-3 rounded-xl bg-secondary border border-border flex items-center justify-between text-xs font-semibold">
                    <span className="text-foreground">Testing Code: <strong className="text-primary font-mono text-sm ml-1">{debugOtp}</strong></span>
                    <button
                      type="button"
                      onClick={() => setOtpCode(debugOtp)}
                      className="px-2.5 py-1 rounded bg-primary text-primary-foreground text-[10px] font-bold shadow-sm"
                    >
                      Auto-Fill
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2 text-center">
                    Enter 6-Digit Email Verification Code:
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center tracking-[0.5em] text-2xl font-black bg-secondary/50 border border-border rounded-2xl py-3.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {loading ? 'Verifying Code...' : 'Verify OTP & Activate Account'}
                </button>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsOtpStep(false)}
                    className="text-muted-foreground hover:text-foreground font-medium"
                  >
                    ← Edit Details
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendTimer > 0}
                    className="text-primary hover:underline font-bold disabled:text-muted-foreground flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${resendTimer > 0 ? 'animate-spin' : ''}`} />
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend Code'}
                  </button>
                </div>
              </form>
            )}

            {/* Footer switch to login */}
            {!isOtpStep && (
              <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground font-medium">
                Already have a Routiva account?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
