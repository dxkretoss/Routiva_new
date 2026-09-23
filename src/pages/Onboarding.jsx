import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Car, 
  Search, 
  ArrowRight, 
  User, 
  Camera, 
  UploadCloud, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Route,
  Briefcase,
  Building,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { invokeEdgeFunction } from '../lib/edgeFunctions';
import SearchableLocalitySelect from '../components/SearchableLocalitySelect';
import SearchableProfessionSelect from '../components/SearchableProfessionSelect';

export default function Onboarding() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile, vehicle, updateProfile } = useAuth();
  const { addToast } = useNotifications();

  // Role is strictly 'rider' or 'seeker', passed from registration or session
  const roleParam = searchParams.get('role') || user?.role || 'rider';
  const role = roleParam === 'seeker' ? 'seeker' : 'rider';

  // For Rider: 2 Steps (1. Profile, 2. Vehicle). For Seeker: 1 Step (1. Profile)
  const totalSteps = role === 'rider' ? 2 : 1;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Helper to extract best initial name
  const getInitialName = () => {
    if (profile?.full_name) return profile.full_name;
    if (profile?.name) return profile.name;
    if (user?.full_name) return user.full_name;
    try {
      const saved = localStorage.getItem('routiva_current_session');
      if (saved) {
        const s = JSON.parse(saved);
        if (s.profile?.full_name) return s.profile.full_name;
        if (s.user?.full_name) return s.user.full_name;
      }
    } catch {}
    return '';
  };

  const initialProfession = profile?.profession || 'Corporate Employee';

  // Profile Form Data
  const [profileData, setProfileData] = useState({
    full_name: getInitialName(),
    age: profile?.age || 27,
    gender: profile?.gender || 'male',
    avatar_url: profile?.avatar_url || '',
    bio: profile?.bio || '',
    home_locality: profile?.home_locality || 'Nikol',
    work_locality: profile?.work_locality || 'Thaltej',
    profession: initialProfession,
    company_name: profile?.company_name || 'Tech Park Ltd',
    work_email: profile?.work_email || '',
    city: profile?.city || 'Ahmedabad',
    is_corporate_verified: profile?.is_corporate_verified || false
  });

  // Auto-sync full name and profile details when user/profile session becomes available
  useEffect(() => {
    const candidateName = profile?.full_name || profile?.name || user?.full_name;
    if (candidateName) {
      setProfileData((prev) => ({
        ...prev,
        full_name: prev.full_name || candidateName,
        age: profile?.age || prev.age,
        gender: profile?.gender || prev.gender,
        profession: profile?.profession || prev.profession
      }));
    }
  }, [profile, user]);

  // Vehicle Form Data
  const [vehicleData, setVehicleData] = useState({
    vehicle_type: vehicle?.vehicle_type || 'car',
    brand: vehicle?.brand || 'Hyundai',
    model: vehicle?.model || 'i20',
    colour: vehicle?.colour || 'Polar White',
    registration_number: vehicle?.registration_number || 'GJ 01 XX 1234',
    available_seats: vehicle?.available_seats || 2,
    has_ac: vehicle?.has_ac ?? true,
    smoking_allowed: vehicle?.smoking_allowed ?? false,
    fuel_type: vehicle?.fuel_type || 'petrol',
    vehicle_image_url: vehicle?.vehicle_image_url || ''
  });

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size should be less than 5MB', 'error');
      return;
    }
    setUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      try {
        const res = await invokeEdgeFunction('upload-image', {
          userId: user?.id,
          imageBase64: base64,
          bucket: 'routiva-media',
          folder: 'avatars'
        });
        if (res?.success && res.imageUrl) {
          setProfileData((prev) => ({ ...prev, avatar_url: res.imageUrl }));
          addToast('Profile photo uploaded!', 'success');
        } else {
          setProfileData((prev) => ({ ...prev, avatar_url: base64 }));
        }
      } catch (err) {
        setProfileData((prev) => ({ ...prev, avatar_url: base64 }));
      } finally {
        setUploadingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };



  const handleNext = (e) => {
    e?.preventDefault();
    if (step === 1) {
      if (!profileData.full_name?.trim()) {
        addToast('Please enter your full name.', 'error');
        return;
      }
      if (!profileData.profession?.trim()) {
        addToast('Please select or enter your profession.', 'error');
        return;
      }
      if (!profileData.home_locality?.trim()) {
        addToast('Please select or enter your residential locality.', 'error');
        return;
      }
      if (!profileData.work_locality?.trim()) {
        addToast('Please select or enter your work/office locality.', 'error');
        return;
      }

      if (role === 'seeker') {
        handleSubmit();
      } else {
        setStep(2);
      }
    } else if (step === 2) {
      if (!vehicleData.brand?.trim() || !vehicleData.model?.trim() || !vehicleData.registration_number?.trim()) {
        addToast('Please fill in required vehicle brand, model, and registration number.', 'error');
        return;
      }
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await updateProfile(profileData, role, role === 'rider' ? vehicleData : null);
      if (res?.success) {
        addToast('Profile setup complete! Create your daily commute route.', 'success');
        navigate('/create-commute');
      } else {
        addToast(res?.error || 'Could not save profile details.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('An error occurred while saving setup.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground grid grid-cols-1 lg:grid-cols-12">
      {/* LEFT SIDE: Platform Graphic & Commute Setup Showcase (Desktop) */}
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
        <div className="my-auto py-6 relative z-10 space-y-5 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-secondary-foreground text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Step {step} of {totalSteps} • {step === 1 ? 'Profile Setup' : 'Vehicle Setup'}</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black text-foreground tracking-tight leading-tight">
            {step === 1 ? (
              <>
                Complete your profile. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                  Build verified trust.
                </span>
              </>
            ) : (
              <>
                Add vehicle details. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                  Share empty seats easily.
                </span>
              </>
            )}
          </h1>

          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed font-medium">
            {step === 1 
              ? 'Your profile establishes mutual trust and helps pair you with verified coworkers and commuters along your exact corridor in Ahmedabad & Gandhinagar.'
              : 'Specify your vehicle model, seat capacity, and amenities so daily seekers know what to expect on their shared ride.'}
          </p>

          {/* Interactive Feature Showcase Cards */}
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-foreground">
                  {role === 'rider' ? 'Vehicle Owner Perks' : 'Daily Seeker Perks'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-primary bg-secondary px-2.5 py-0.5 rounded-full border border-border">
                Ahmedabad Corridor
              </span>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-secondary/50 border border-border">
                <div className="p-1 rounded-lg bg-card text-primary border border-border shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-foreground text-xs font-medium">
                  {role === 'rider' ? 'Recover ₹3,000–₹5,000 in monthly petrol costs' : 'Save up to 65% compared to surge daily cab rides'}
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-secondary/50 border border-border">
                <div className="p-1 rounded-lg bg-card text-primary border border-border shrink-0">
                  <Route className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-foreground text-xs font-medium">
                  Intermediate route matching — drop partners along your path
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-secondary/50 border border-border">
                <div className="p-1 rounded-lg bg-card text-primary border border-border shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-foreground text-xs font-medium">
                  100% verified corporate & office commuter community
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Safety & Trust */}
        <div className="pt-4 border-t border-border/80 flex items-center justify-between text-xs text-muted-foreground font-medium relative z-10">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Verified & Privacy Protected
          </span>
          <span className="font-bold text-foreground">Routiva Commute</span>
        </div>
      </div>

      {/* RIGHT SIDE: Onboarding Steps Form */}
      <div className="col-span-12 lg:col-span-7 xl:col-span-7 flex flex-col justify-center items-center px-4 sm:px-8 xl:px-14 py-8 sm:py-12 relative min-h-screen">
        {/* Mobile Header Logo */}
        <div className="lg:hidden text-center mb-6 w-full">
          <Link to="/" className="inline-block group">
            <img 
              src="/assets/images/routiva-logo-desktop.png" 
              alt="Routiva Logo" 
              className="h-8 w-auto object-contain mx-auto transition-transform group-hover:scale-105" 
            />
          </Link>
        </div>

        <div className="w-full max-w-xl space-y-5">
          {/* Progress Header */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-secondary px-2.5 py-0.5 rounded-full border border-border">
                Step {step} of {totalSteps} • {role === 'rider' ? 'Rider Onboarding' : 'Seeker Onboarding'}
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                {totalSteps === 1 ? '100%' : (step === 1 ? '50%' : '100%')} Complete
              </span>
            </div>

            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden border border-border">
              <div 
                className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full transition-all duration-300"
                style={{ width: totalSteps === 1 ? '100%' : (step === 1 ? '50%' : '100%') }}
              ></div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-foreground pt-1.5 tracking-tight">
              {step === 1 ? 'Complete Your Profile' : 'Add Your Vehicle Details'}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              {step === 1 
                ? 'This helps us find compatible office commuters along your path' 
                : 'Specify vehicle capacity and comfort for shared rides'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-7 shadow-card space-y-4">
            {/* STEP 1: PROFILE DETAILS */}
            {step === 1 && (
              <div className="space-y-4 animate-fadeIn">
                {/* Avatar Profile Photo Upload */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-border">
                  <div className="relative w-16 h-16 rounded-2xl bg-secondary border border-border overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                    {profileData.avatar_url ? (
                      <img src={profileData.avatar_url} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-muted-foreground" />
                    )}
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-bold text-foreground">Profile Photo</span>
                    <span className="text-[11px] text-muted-foreground block mb-1.5 font-medium">Upload a clear photo for identity verification</span>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border hover:border-primary text-xs font-bold text-foreground cursor-pointer transition-all shadow-sm">
                      <Camera className="w-3.5 h-3.5 text-primary" />
                      <span>{profileData.avatar_url ? 'Change Photo' : 'Upload Avatar'}</span>
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Age
                    </label>
                    <input
                      type="number"
                      value={profileData.age}
                      onChange={(e) => setProfileData({ ...profileData, age: parseInt(e.target.value, 10) || 18 })}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Gender
                    </label>
                    <select
                      value={profileData.gender}
                      onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Profession (Searchable Dropdown with High-Level Roles & Custom Input) + City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SearchableProfessionSelect
                    label="Profession / Job Category *"
                    value={profileData.profession}
                    onChange={(val) => setProfileData(prev => ({ ...prev, profession: val }))}
                    placeholder="Select or enter your profession..."
                    required
                  />

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-primary" />
                      <span>City</span>
                    </label>
                    <select
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Gandhinagar">Gandhinagar</option>
                    </select>
                  </div>
                </div>

                {/* Residential & Work Localities with Searchable Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <SearchableLocalitySelect
                    label="Residential Locality *"
                    value={profileData.home_locality}
                    onChange={(val) => setProfileData(prev => ({ ...prev, home_locality: val }))}
                    placeholder="Search or pick residential area..."
                    dropUp={true}
                    required
                  />

                  <SearchableLocalitySelect
                    label="Work / Office Locality *"
                    value={profileData.work_locality}
                    onChange={(val) => setProfileData(prev => ({ ...prev, work_locality: val }))}
                    placeholder="Search or pick office area..."
                    dropUp={true}
                    required
                  />
                </div>
              </div>
            )}

            {/* STEP 2: VEHICLE DETAILS (IF RIDER) */}
            {step === 2 && role === 'rider' && (
              <div className="space-y-4 animate-fadeIn">

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Vehicle Type
                    </label>
                    <select
                      value={vehicleData.vehicle_type}
                      onChange={(e) => setVehicleData({ ...vehicleData, vehicle_type: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="car">Car (Petrol/Diesel/CNG)</option>
                      <option value="ev_car">EV Car</option>
                      <option value="bike">Motorcycle / Bike</option>
                      <option value="scooter">Scooter / Activa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Available Commute Seats *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={vehicleData.available_seats}
                      onChange={(e) => setVehicleData({ ...vehicleData, available_seats: parseInt(e.target.value, 10) || 1 })}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Brand *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hyundai, Tata, Honda"
                      value={vehicleData.brand}
                      onChange={(e) => setVehicleData({ ...vehicleData, brand: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Model *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. i20, Nexon, City"
                      value={vehicleData.model}
                      onChange={(e) => setVehicleData({ ...vehicleData, model: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Colour
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Polar White, Grey"
                      value={vehicleData.colour}
                      onChange={(e) => setVehicleData({ ...vehicleData, colour: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="GJ 01 XX 0000"
                      value={vehicleData.registration_number}
                      onChange={(e) => setVehicleData({ ...vehicleData, registration_number: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="mt-8 pt-5 border-t border-border flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground font-bold text-xs hover:bg-slate-200 transition-all"
                >
                  Previous Step
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-glow flex items-center gap-1.5 transition-all disabled:opacity-50 ml-auto"
              >
                {loading 
                  ? 'Saving Setup...' 
                  : (step === totalSteps 
                      ? 'Complete Profile & Create Commute' 
                      : 'Continue to Vehicle Setup')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
