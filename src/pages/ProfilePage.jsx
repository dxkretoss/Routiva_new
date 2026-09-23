import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  Save, 
  Star, 
  CheckCircle2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function ProfilePage() {
  const { profile, vehicle, role, updateProfile } = useAuth();
  const { addToast } = useNotifications();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    profession: profile?.profession || '',
    occupation_type: profile?.occupation_type || '',
    city: profile?.city || 'Ahmedabad',
    area: profile?.area || '',
    landmark: profile?.landmark || '',
    avatar_url: profile?.avatar_url || ''
  });

  const [vehicleData, setVehicleData] = useState({
    vehicle_type: vehicle?.vehicle_type || 'car',
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    colour: vehicle?.colour || '',
    registration_number: vehicle?.registration_number || '',
    available_seats: vehicle?.available_seats || 2
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData, role, role !== 'seeker' ? vehicleData : null);
      setIsEditing(false);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast('Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        {/* Profile Card */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-border">
            <div className="relative">
              <img
                src={formData.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                alt="Profile"
                className="w-24 h-24 rounded-3xl object-cover border-2 border-primary shadow-sm"
              />
              <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-1.5 rounded-xl shadow-md">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-foreground">{profile?.full_name || 'Commuter'}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold border border-border uppercase tracking-wider">
                  {role || 'Seeker'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                {profile?.profession || 'Corporate Professional'}
              </p>
              <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                {profile?.area || 'Nikol'}, {profile?.city || 'Ahmedabad'}
              </p>
            </div>

            <div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-xl bg-secondary border border-border hover:border-primary text-xs font-bold text-foreground transition-all shadow-sm"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Verification Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-6 border-b border-border text-xs">
            <div className="bg-secondary/40 p-3 rounded-2xl border border-border text-center">
              <span className="text-muted-foreground block text-[10px] font-semibold">Email OTP</span>
              <span className="font-bold text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            </div>

            <div className="bg-secondary/40 p-3 rounded-2xl border border-border text-center">
              <span className="text-muted-foreground block text-[10px] font-semibold">Mobile Verified</span>
              <span className="font-bold text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Yes
              </span>
            </div>

            <div className="bg-secondary/40 p-3 rounded-2xl border border-border text-center">
              <span className="text-muted-foreground block text-[10px] font-semibold">Community Rating</span>
              <span className="font-bold text-amber-600 flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 4.95 / 5.0
              </span>
            </div>

            <div className="bg-secondary/40 p-3 rounded-2xl border border-border text-center">
              <span className="text-muted-foreground block text-[10px] font-semibold">Trips Shared</span>
              <span className="font-bold text-foreground block mt-0.5">
                {profile?.trips_completed || 24} Commutes
              </span>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleSave} className="pt-6 space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Profession / Job</label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Area</label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Landmark</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Vehicle edit if Rider */}
              {role !== 'seeker' && (
                <div className="pt-4 border-t border-border space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Vehicle Info</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-muted-foreground font-semibold mb-1">Brand</label>
                      <input
                        type="text"
                        value={vehicleData.brand}
                        onChange={(e) => setVehicleData({ ...vehicleData, brand: e.target.value })}
                        className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-muted-foreground font-semibold mb-1">Model</label>
                      <input
                        type="text"
                        value={vehicleData.model}
                        onChange={(e) => setVehicleData({ ...vehicleData, model: e.target.value })}
                        className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-muted-foreground font-semibold mb-1">Available Seats</label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={vehicleData.available_seats}
                        onChange={(e) => setVehicleData({ ...vehicleData, available_seats: parseInt(e.target.value, 10) })}
                        className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition-all mt-4"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Updating Profile via Edge Function...' : 'Save Profile Changes'}
              </button>
            </form>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
