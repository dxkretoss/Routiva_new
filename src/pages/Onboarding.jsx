import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Car, 
  Search, 
  ArrowRight, 
  User, 
  Repeat,
  Camera,
  UploadCloud,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { invokeEdgeFunction } from '../lib/edgeFunctions';

export default function Onboarding() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'seeker';
  const navigate = useNavigate();
  const { user, profile, vehicle, updateProfile } = useAuth();
  const { addToast } = useNotifications();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingVehicle, setUploadingVehicle] = useState(false);

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

  // Profile Form Data
  const [profileData, setProfileData] = useState({
    full_name: getInitialName(),
    age: profile?.age || 27,
    gender: profile?.gender || 'male',
    avatar_url: profile?.avatar_url || '',
    bio: profile?.bio || '',
    home_locality: profile?.home_locality || 'Nikol',
    work_locality: profile?.work_locality || 'Thaltej',
    profession: profile?.profession || 'Software Engineer',
    company_name: profile?.company_name || 'Tech Park Ltd',
    work_email: profile?.work_email || '',
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
    registration_number: vehicle?.registration_number || 'GJ01-XX-1234',
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

  const handleVehiclePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size should be less than 5MB', 'error');
      return;
    }
    setUploadingVehicle(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      try {
        const res = await invokeEdgeFunction('upload-image', {
          userId: user?.id,
          imageBase64: base64,
          bucket: 'routiva-media',
          folder: 'vehicles'
        });
        if (res?.success && res.imageUrl) {
          setVehicleData((prev) => ({ ...prev, vehicle_image_url: res.imageUrl }));
          addToast('Vehicle photo uploaded!', 'success');
        } else {
          setVehicleData((prev) => ({ ...prev, vehicle_image_url: base64 }));
        }
      } catch (err) {
        setVehicleData((prev) => ({ ...prev, vehicle_image_url: base64 }));
      } finally {
        setUploadingVehicle(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (role === 'seeker') {
        handleSubmit();
      } else {
        setStep(3); // Vehicle details
      }
    } else if (step === 3) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await updateProfile(profileData, role !== 'seeker' ? vehicleData : null);
      if (res?.success) {
        addToast('Welcome aboard! Let us create your first recurring commute.', 'success');
        navigate('/create-commute');
      } else {
        addToast(res?.error || 'Could not save details.', 'error');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-primary/10 rounded-full blur-[110px] pointer-events-none"></div>

      <div className="max-w-xl w-full mx-auto relative z-10">
        {/* Brand Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block group">
            <img 
              src="/assets/images/routiva-logo-desktop.png" 
              alt="Routiva Logo" 
              className="h-8 w-auto object-contain mx-auto transition-transform group-hover:scale-105" 
            />
          </Link>
        </div>

        {/* Progress header */}
        <div className="mb-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-secondary px-3 py-1 rounded-full border border-border">
            Step {step} of {role === 'seeker' ? 2 : 3} • Commuter Setup
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-3">
            {step === 1 && 'Choose Your Commute Role'}
            {step === 2 && 'Complete Your Profile'}
            {step === 3 && 'Add Your Vehicle Details'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
            {step === 1 && 'Tell us how you plan to travel every morning'}
            {step === 2 && 'This helps us find compatible office commuters'}
            {step === 3 && 'Specify vehicle capacity and comfort for shared rides'}
          </p>
        </div>

        {/* Step Card */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card">
          {/* STEP 1: ROLE SELECTION */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div
                onClick={() => setRole('rider')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  role === 'rider'
                    ? 'bg-secondary border-primary shadow-sm'
                    : 'bg-card border-border hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold border border-border shadow-sm">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Rider (Vehicle Owner)</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">I drive daily and want to share empty seats to split petrol</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  role === 'rider' ? 'border-primary bg-primary' : 'border-slate-300'
                }`}>
                  {role === 'rider' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              <div
                onClick={() => setRole('seeker')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  role === 'seeker'
                    ? 'bg-secondary border-primary shadow-sm'
                    : 'bg-card border-border hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold border border-border shadow-sm">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Seeker (Need a Daily Ride)</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">I want a dependable daily ride without surge cab prices</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  role === 'seeker' ? 'border-primary bg-primary' : 'border-slate-300'
                }`}>
                  {role === 'seeker' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              <div
                onClick={() => setRole('both')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  role === 'both'
                    ? 'bg-secondary border-primary shadow-sm'
                    : 'bg-card border-border hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold border border-border shadow-sm">
                    <Repeat className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Both (Drive some days, Ride others)</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">Flexible commute role according to my schedule</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  role === 'both' ? 'border-primary bg-primary' : 'border-slate-300'
                }`}>
                  {role === 'both' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PROFILE DETAILS */}
          {step === 2 && (
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
                    onChange={(e) => setProfileData({ ...profileData, age: parseInt(e.target.value, 10) })}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Profession / Job Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={profileData.profession}
                    onChange={(e) => setProfileData({ ...profileData, profession: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    City
                  </label>
                  <select
                    value={profileData.city}
                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Gandhinagar">Gandhinagar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Residential Area *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nikol, Naroda, Bapunagar"
                    value={profileData.home_locality || ''}
                    onChange={(e) => setProfileData({ ...profileData, home_locality: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Work Locality *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Thaltej, SG Highway, GIFT City"
                    value={profileData.work_locality || ''}
                    onChange={(e) => setProfileData({ ...profileData, work_locality: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: VEHICLE DETAILS (IF RIDER) */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Vehicle Photo Upload */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-border">
                <div className="relative w-20 h-14 rounded-2xl bg-secondary border border-border overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                  {vehicleData.vehicle_image_url ? (
                    <img src={vehicleData.vehicle_image_url} alt="Vehicle Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Car className="w-6 h-6 text-primary" />
                  )}
                  {uploadingVehicle && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-bold text-foreground">Vehicle Photo</span>
                  <span className="text-[11px] text-muted-foreground block mb-1.5 font-medium">Upload photo of your car/bike</span>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border hover:border-primary text-xs font-bold text-foreground cursor-pointer transition-all shadow-sm">
                    <UploadCloud className="w-3.5 h-3.5 text-primary" />
                    <span>{vehicleData.vehicle_image_url ? 'Change Vehicle Photo' : 'Upload Photo'}</span>
                    <input type="file" accept="image/*" onChange={handleVehiclePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

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
                    onChange={(e) => setVehicleData({ ...vehicleData, available_seats: parseInt(e.target.value, 10) })}
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
                className="px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground font-bold text-xs"
              >
                Previous Step
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-glow flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving Setup...' : step === (role === 'seeker' ? 2 : 3) ? 'Complete Profile & Create Commute' : 'Continue to Next Step'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
