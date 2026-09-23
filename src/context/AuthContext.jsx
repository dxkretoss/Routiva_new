import React, { createContext, useContext, useState, useEffect } from 'react';
import { invokeEdgeFunction } from '../lib/edgeFunctions';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session from storage on start
  useEffect(() => {
    try {
      const saved = localStorage.getItem('routiva_current_session');
      if (saved) {
        const session = JSON.parse(saved);
        const demoIds = ['user_rahul_01', 'user_priya_02', 'user_ananya_03', 'user_rohit_04'];
        if (demoIds.includes(session.user?.id) || demoIds.includes(session.userId)) {
          localStorage.removeItem('routiva_current_session');
          setUser(null);
          setProfile(null);
          setVehicle(null);
          setRole(null);
          setToken(null);
        } else {
          setUser(session.user);
          setProfile(session.profile);
          setVehicle(session.vehicle || null);
          setRole(session.role || session.profile?.role || 'seeker');
          setToken(session.token);

          // Fetch freshest profile and vehicle from Edge Function Store
          if (session.user?.id) {
            invokeEdgeFunction('get-profile', { userId: session.user.id })
              .then((res) => {
                if (res?.success) {
                  if (res.profile) {
                    setProfile(res.profile);
                    if (res.profile.role) setRole(res.profile.role);
                  }
                  if (res.vehicle) setVehicle(res.vehicle);
                }
              })
              .catch(() => {});
          }
        }
      }
    } catch (e) {
      console.error('Session load error', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSession = (sessionData) => {
    setUser(sessionData.user);
    setProfile(sessionData.profile);
    setVehicle(sessionData.vehicle || null);
    setRole(sessionData.role || 'seeker');
    setToken(sessionData.token);
    localStorage.setItem('routiva_current_session', JSON.stringify(sessionData));
  };

  // 1. Step 1 of Registration: Send Email + Phone + Password -> Get OTP
  const registerUser = async (email, phone, password, fullName = '') => {
    return await invokeEdgeFunction('auth-register', { email, phone, password, fullName });
  };

  // 2. Step 2 of Registration: Verify 6-digit Email OTP -> Activate session
  const verifyOtp = async (email, otp, phone, password, fullName = '') => {
    const res = await invokeEdgeFunction('auth-verify-otp', { email, otp, phone, password, fullName });
    if (res.success) {
      saveSession({
        user: res.user,
        profile: res.profile,
        vehicle: null,
        role: 'seeker',
        token: res.token
      });
    }
    return res;
  };

  // 3. Resend OTP
  const resendOtp = async (email) => {
    return await invokeEdgeFunction('auth-resend-otp', { email });
  };

  // 4. Login with Email + Password
  const loginUser = async (email, password) => {
    const res = await invokeEdgeFunction('auth-login', { email, password });
    if (res.success) {
      saveSession({
        user: res.user,
        profile: res.profile,
        vehicle: res.vehicle || null,
        role: res.role || res.profile?.role || 'seeker',
        token: res.token
      });
    }
    return res;
  };

  // 5. Complete Onboarding / Update Profile & Vehicle
  const updateProfile = async (profileData, newRole, vehicleData) => {
    if (!user) return;
    const res = await invokeEdgeFunction('update-profile', {
      userId: user.id,
      profileData,
      role: newRole || role,
      vehicleData
    });
    if (res.success) {
      const updatedProfile = res.profile || profileData;
      const updatedVehicle = res.vehicle || vehicleData || vehicle;
      const updatedRole = newRole || role;
      setProfile(updatedProfile);
      setVehicle(updatedVehicle);
      if (newRole) setRole(updatedRole);
      
      saveSession({
        user,
        profile: updatedProfile,
        vehicle: updatedVehicle,
        role: updatedRole,
        token
      });
    }
    return res;
  };

  // 7. Logout
  const logoutUser = () => {
    setUser(null);
    setProfile(null);
    setVehicle(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem('routiva_current_session');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        vehicle,
        role,
        token,
        loading,
        isAuthenticated: !!user,
        isOnboarded: !!profile?.onboarding_complete,
        registerUser,
        verifyOtp,
        resendOtp,
        loginUser,
        updateProfile,
        logoutUser,
        logout: logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
