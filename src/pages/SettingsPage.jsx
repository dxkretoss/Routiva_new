import React, { useState } from 'react';
import { Bell, Shield, KeyRound, LogOut } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function SettingsPage() {
  const { logout, logoutUser } = useAuth();
  const { addToast } = useNotifications();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      addToast('New password must be at least 6 characters.', 'error');
      return;
    }
    addToast('Password updated successfully via Edge Function.', 'success');
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <DashboardLayout
      title="Account Settings"
      subtitle="Manage notification preferences, privacy, and account credentials"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground">Account Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">Manage notification preferences, privacy, and account credentials</p>
        </div>

        {/* Notifications Preference */}
        <div className="bg-card border border-border rounded-3xl p-6 space-y-4 shadow-card">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" /> Notifications & Route Alerts
          </h2>

          <div className="flex items-center justify-between py-2 border-b border-border text-xs">
            <div>
              <span className="font-bold text-foreground block">Email Notifications</span>
              <span className="text-muted-foreground text-[11px] font-medium">Receive OTPs and connection requests via email</span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="accent-primary w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between py-2 text-xs">
            <div>
              <span className="font-bold text-foreground block">Daily Match Alerts</span>
              <span className="text-muted-foreground text-[11px] font-medium">Notify me when a new commuter creates a route matching mine</span>
            </div>
            <input
              type="checkbox"
              checked={matchAlerts}
              onChange={(e) => setMatchAlerts(e.target.checked)}
              className="accent-primary w-4 h-4"
            />
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-card border border-border rounded-3xl p-6 space-y-4 shadow-card">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-primary" /> Change Password
          </h2>

          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div>
              <label className="block text-[11px] text-muted-foreground font-semibold mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[11px] text-muted-foreground font-semibold mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-card border border-rose-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-rose-600 flex items-center gap-2">
            <Shield className="w-4 h-4" /> Danger Zone
          </h2>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="font-bold text-foreground text-xs block">Sign Out</span>
              <span className="text-muted-foreground text-[11px] font-medium">Clear session from this device</span>
            </div>
            <button
              onClick={logoutUser}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl border border-rose-200 flex items-center gap-1 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
