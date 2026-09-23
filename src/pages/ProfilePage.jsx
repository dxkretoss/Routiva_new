import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  Save, 
  CheckCircle2,
  Mail,
  Phone,
  Car,
  Route,
  Navigation,
  Building,
  User,
  Edit3,
  X,
  PlusCircle,
  Sparkles,
  Camera,
  UploadCloud,
  Fuel
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useCommute } from '../context/CommuteContext';
import { useNotifications } from '../context/NotificationContext';
import { invokeEdgeFunction } from '../lib/edgeFunctions';

export default function ProfilePage() {
  const { user, profile, vehicle, role, updateProfile } = useAuth();
  const { commutes, connections } = useCommute();
  const { addToast } = useNotifications();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    profession: '',
    company: '',
    city: 'Ahmedabad',
    area: '',
    landmark: '',
    avatar_url: '',
    phone: '',
    gender: 'prefer_not_to_say'
  });

  const [vehicleData, setVehicleData] = useState({
    vehicle_type: 'car',
    brand: '',
    model: '',
    colour: '',
    registration_number: '',
    available_seats: 2,
    fuel_type: 'petrol'
  });

  const [selectedRole, setSelectedRole] = useState(role || 'seeker');
  const [saving, setSaving] = useState(false);

  // Sync state whenever profile, user, or vehicle changes
  useEffect(() => {
    if (profile || user) {
      setFormData({
        full_name: profile?.full_name || user?.full_name || '',
        profession: profile?.profession || 'Corporate Professional',
        company: profile?.company || profile?.company_name || '',
        city: profile?.city || 'Ahmedabad',
        area: profile?.area || profile?.home_locality || 'Nikol',
        landmark: profile?.landmark || '',
        avatar_url: profile?.avatar_url || '',
        phone: user?.phone || profile?.phone || '',
        gender: profile?.gender || 'prefer_not_to_say'
      });
      setSelectedRole(role || profile?.role || 'seeker');
    }

    if (vehicle) {
      setVehicleData({
        vehicle_type: vehicle.vehicle_type || 'car',
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        colour: vehicle.colour || vehicle.color || '',
        registration_number: vehicle.registration_number || vehicle.license_plate || '',
        available_seats: vehicle.available_seats || 2,
        fuel_type: vehicle.fuel_type || 'petrol'
      });
    }
  }, [profile, user, vehicle, role]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size must be under 5MB', 'error');
      return;
    }

    setUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      try {
        const res = await invokeEdgeFunction('upload-image', {
          userId: user?.id,
          imageBase64: base64
        });
        const imageUrl = res?.imageUrl || base64;
        setFormData((prev) => ({ ...prev, avatar_url: imageUrl }));
        
        // Save immediately to profile
        await updateProfile(
          { ...formData, avatar_url: imageUrl }, 
          selectedRole, 
          selectedRole === 'rider' ? vehicleData : vehicle
        );
        addToast('Profile photo updated successfully!', 'success');
      } catch (err) {
        addToast('Failed to upload image.', 'error');
      } finally {
        setUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(
        formData, 
        selectedRole, 
        selectedRole === 'rider' ? vehicleData : vehicle
      );
      setIsEditing(false);
      addToast('Profile & preferences updated successfully!', 'success');
    } catch (err) {
      addToast(err?.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile?.full_name || user?.full_name || formData.full_name || 'Commuter';
  const displayAvatar = profile?.avatar_url || formData.avatar_url;
  const displayInitials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'U';

  const activeVehicle = vehicle || (vehicleData.brand ? vehicleData : null);

  return (
    <DashboardLayout
      title="My Profile & Vehicle"
      subtitle="Identity verification, commute preferences and vehicle details"
    >
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        {/* Hidden File Input for Avatar Upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoUpload}
          accept="image/*"
          className="hidden"
        />

        {/* TOP PROFILE HERO CARD */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-border">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              {/* Dynamic User Avatar with Upload Trigger */}
              <div className="relative group">
                <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-3xl bg-primary/10 border-2 border-primary flex items-center justify-center font-black text-2xl sm:text-3xl text-primary overflow-hidden shadow-sm">
                  {displayAvatar ? (
                    <img
                      src={displayAvatar}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{displayInitials}</span>
                  )}
                </div>

                {/* Upload / Change Photo Overlay Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute inset-0 rounded-3xl bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all cursor-pointer text-[10px] font-bold"
                  title="Upload profile photo"
                >
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span>{uploadingPhoto ? 'Uploading...' : 'Change'}</span>
                </button>

                <div
                  className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-xl shadow-md border-2 border-card"
                  title="OTP Verified Account"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              {/* Dynamic User Identity Information */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                    {displayName}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    role === 'rider'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {role === 'rider' ? '🚗 Vehicle Owner / Rider' : '🚶 Commuter / Seeker'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5 text-foreground font-semibold">
                    <Briefcase className="w-3.5 h-3.5 text-primary" />
                    {profile?.profession || formData.profession || 'Corporate Professional'}
                  </span>
                  {(profile?.company || profile?.company_name || formData.company) && (
                    <span className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-primary" />
                      {profile?.company || profile?.company_name || formData.company}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {profile?.area || profile?.home_locality || formData.area || 'Nikol'}, {profile?.city || formData.city || 'Ahmedabad'}
                  </span>
                </div>

                {/* Email & Phone Contact Bar */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    {user?.email || profile?.email || 'Registered Email'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                    {user?.phone || profile?.phone || '+91 Not Set'}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Profile Action Button */}
            <div>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                  isEditing
                    ? 'bg-secondary text-foreground hover:bg-slate-200'
                    : 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-glow'
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* DYNAMIC VERIFICATION & METRIC STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-secondary/40 p-3.5 rounded-2xl border border-border text-center space-y-1">
              <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-wider">
                Email Authentication
              </span>
              <span className="font-bold text-emerald-600 flex items-center justify-center gap-1 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" /> OTP Verified
              </span>
            </div>

            <div className="bg-secondary/40 p-3.5 rounded-2xl border border-border text-center space-y-1">
              <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-wider">
                Mobile Number
              </span>
              <span className="font-bold text-emerald-600 flex items-center justify-center gap-1 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active & Linked
              </span>
            </div>

            <div className="bg-secondary/40 p-3.5 rounded-2xl border border-border text-center space-y-1">
              <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-wider">
                Published Corridors
              </span>
              <span className="font-black text-primary block text-sm">
                {commutes.length} {commutes.length === 1 ? 'Route' : 'Routes'}
              </span>
            </div>

            <div className="bg-secondary/40 p-3.5 rounded-2xl border border-border text-center space-y-1">
              <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-wider">
                Ride Connections
              </span>
              <span className="font-black text-foreground block text-sm">
                {connections.length} Connections
              </span>
            </div>
          </div>

          {/* EDIT PROFILE FORM */}
          {isEditing && (
            <form onSubmit={handleSave} className="pt-6 border-t border-border space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-foreground flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-primary" />
                  <span>Update Profile & Vehicle Details</span>
                </h3>
              </div>

              {/* Commute Role Selection */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">Commute Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('seeker')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2.5 ${
                      selectedRole === 'seeker'
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <User className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="font-black">Daily Commuter / Seeker</div>
                      <div className="text-[10px] font-normal text-muted-foreground">Looking for rides & carpools</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('rider')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2.5 ${
                      selectedRole === 'rider'
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Car className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="font-black">Vehicle Owner / Rider</div>
                      <div className="text-[10px] font-normal text-muted-foreground">Offering seats in my car/bike</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Profession / Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    placeholder="e.g. Software Engineer, Doctor, CA"
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Company / Workplace</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. TCS, Infosys, Adani, GIFT City"
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Residential Locality *</label>
                  <input
                    type="text"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g. Nikol, Bopal, Vastrapur"
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Vehicle Form Fields (If Rider is selected) */}
              {selectedRole === 'rider' && (
                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5" />
                      <span>Vehicle Information</span>
                    </h4>
                    <span className="text-[10px] text-muted-foreground">Required for vehicle owners</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] text-muted-foreground font-semibold mb-1">Vehicle Type</label>
                      <select
                        value={vehicleData.vehicle_type}
                        onChange={(e) => setVehicleData({ ...vehicleData, vehicle_type: e.target.value })}
                        className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                      >
                        <option value="car">Car (4-Wheeler)</option>
                        <option value="bike">Bike / Scooter (2-Wheeler)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-muted-foreground font-semibold mb-1">Brand</label>
                      <input
                        type="text"
                        value={vehicleData.brand}
                        onChange={(e) => setVehicleData({ ...vehicleData, brand: e.target.value })}
                        placeholder="e.g. Hyundai, Honda, Maruti"
                        className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-muted-foreground font-semibold mb-1">Model</label>
                      <input
                        type="text"
                        value={vehicleData.model}
                        onChange={(e) => setVehicleData({ ...vehicleData, model: e.target.value })}
                        placeholder="e.g. i20, City, Swift"
                        className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-muted-foreground font-semibold mb-1">Plate Number</label>
                      <input
                        type="text"
                        value={vehicleData.registration_number}
                        onChange={(e) => setVehicleData({ ...vehicleData, registration_number: e.target.value.toUpperCase() })}
                        placeholder="e.g. GJ01AB1234"
                        className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary uppercase font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-muted-foreground font-semibold mb-1">Available Seats</label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={vehicleData.available_seats}
                        onChange={(e) => setVehicleData({ ...vehicleData, available_seats: parseInt(e.target.value, 10) })}
                        className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-muted-foreground font-semibold mb-1">Fuel Type</label>
                      <select
                        value={vehicleData.fuel_type}
                        onChange={(e) => setVehicleData({ ...vehicleData, fuel_type: e.target.value })}
                        className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                      >
                        <option value="petrol">Petrol</option>
                        <option value="cng">CNG</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric (EV)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-secondary border border-border text-foreground text-xs font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-glow flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* REGISTERED VEHICLE CARD (For Riders or Users with Registered Vehicle) */}
        {(role === 'rider' || activeVehicle?.brand) && (
          <div className="bg-card border border-border rounded-3xl p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Car className="w-4 h-4 text-primary" />
                  <span>My Registered Commute Vehicle</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Vehicle used for offering ride seats and fuel cost splits
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('rider');
                  setIsEditing(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-bold border border-border transition-all flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Vehicle</span>
              </button>
            </div>

            {activeVehicle?.brand ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Brand & Model</span>
                  <span className="font-black text-foreground text-sm block truncate">
                    {activeVehicle.brand} {activeVehicle.model}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">License Plate</span>
                  <span className="font-black text-foreground font-mono text-sm block truncate">
                    {activeVehicle.registration_number || activeVehicle.license_plate}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Seat Capacity</span>
                  <span className="font-black text-foreground text-sm block">
                    {activeVehicle.available_seats || 2} Available Seats
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Fuel & Type</span>
                  <span className="font-bold text-foreground capitalize text-sm block">
                    {activeVehicle.fuel_type || 'Petrol'} • {activeVehicle.vehicle_type || 'Car'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-secondary/20 border border-dashed border-border text-center space-y-2">
                <Car className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                <h4 className="text-xs font-bold text-foreground">No Vehicle Registered Yet</h4>
                <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                  Add your car or two-wheeler details to start offering seats and split fuel costs.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('rider');
                    setIsEditing(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-glow inline-flex items-center gap-1.5 mt-2"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Register Vehicle
                </button>
              </div>
            )}
          </div>
        )}

        {/* ACTIVE COMMUTE CORRIDORS CARD */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <Route className="w-4 h-4 text-primary" />
                <span>My Active Route Corridors ({commutes.length})</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Your registered daily transit corridors in Ahmedabad & Gandhinagar
              </p>
            </div>

            <Link
              to="/create-commute"
              className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create New Route</span>
            </Link>
          </div>

          {commutes.length === 0 ? (
            <div className="p-8 rounded-2xl bg-secondary/20 border border-dashed border-border text-center space-y-3">
              <Navigation className="w-8 h-8 text-muted-foreground/50 mx-auto" />
              <h4 className="text-sm font-bold text-foreground">No Commute Corridors Created Yet</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Publish your daily transit corridor to get automatically paired with verified colleagues on your route.
              </p>
              <Link
                to="/create-commute"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-glow"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Set Up Daily Corridor
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {commutes.map((commute, idx) => (
                <div
                  key={commute.id || idx}
                  className="p-4 sm:p-5 rounded-2xl bg-secondary/30 border border-border space-y-3 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/80">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        commute.commute_type === 'rider'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {commute.commute_type === 'rider' ? '🚗 Vehicle Owner' : '🚶 Passenger'}
                      </span>
                      <span className="text-xs font-black text-foreground">
                        {commute.start_location} → {commute.destination_location}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-primary">
                      {commute.departure_time || '8:30 AM'} • {commute.days?.join(', ') || 'Mon-Fri'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
                    <div>Origin: <strong className="text-foreground">{commute.start_location}</strong></div>
                    <div>Destination: <strong className="text-foreground">{commute.destination_location}</strong></div>
                    <div>Stops: <strong className="text-foreground">{commute.route_points?.length || 0} Points</strong></div>
                    <div>Split: <strong className="text-foreground">₹{commute.contribution_amount || 50}/day</strong></div>
                  </div>

                  {/* Waypoint chips */}
                  {commute.route_points && commute.route_points.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {commute.route_points.map((pt, pIdx) => (
                        <span key={pIdx} className="px-2 py-0.5 rounded-md bg-card border border-border text-[10px] font-semibold text-foreground">
                          {pIdx + 1}. {pt.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
