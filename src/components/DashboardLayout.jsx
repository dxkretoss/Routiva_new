import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  Users, 
  PlusCircle, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  ShieldCheck, 
  Car, 
  Search,
  Route,
  ChevronRight,
  ExternalLink,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCommute } from '../context/CommuteContext';
import { useNotifications } from '../context/NotificationContext';

export default function DashboardLayout({ children, title, subtitle }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const { user, profile, role, logout } = useAuth();
  const { matches, connections, activeCommute } = useCommute();
  const { notifications, unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const pendingRequestsCount = connections.filter((c) => c.status === 'pending').length;
  const matchesCount = matches?.length || 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Find Matches',
      path: '/matches',
      icon: Sparkles,
      badge: matchesCount > 0 ? `${matchesCount}` : null,
      badgeColor: 'bg-primary text-primary-foreground'
    },
    {
      name: 'Ride Connections',
      path: '/connections',
      icon: Users,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : null,
      badgeColor: 'bg-orange-500 text-white animate-pulse'
    },
    {
      name: 'Create Commute',
      path: '/create-commute',
      icon: PlusCircle,
      badge: null
    },
    {
      name: 'My Profile',
      path: '/profile',
      icon: User,
      badge: null
    },
    {
      name: 'Account Settings',
      path: '/settings',
      icon: Settings,
      badge: null
    }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 select-none">
      {/* Top Part: Logo & User Card */}
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-2 pt-1">
          <Link to="/dashboard" className="inline-block group">
            <img
              src="/assets/images/routiva-logo-desktop.png"
              alt="Routiva"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <span className="text-[10px] font-bold text-primary bg-secondary px-2 py-0.5 rounded-full border border-border">
            Ahmedabad
          </span>
        </div>

        {/* User Quick Profile Card */}
        <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/80 shadow-sm space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl bg-secondary border border-border overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || 'Avatar'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black text-foreground truncate">
                {profile?.full_name || user?.full_name || 'Commuter'}
              </h4>
              <p className="text-[11px] text-muted-foreground truncate font-medium">
                {profile?.profession || 'Corporate Professional'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[10px]">
            <span className="inline-flex items-center gap-1 font-bold text-primary">
              {role === 'rider' ? (
                <>
                  <Car className="w-3 h-3 text-primary" /> Verified Rider
                </>
              ) : (
                <>
                  <Search className="w-3 h-3 text-orange-500" /> Daily Seeker
                </>
              )}
            </span>
            <span className="text-muted-foreground font-semibold">
              {profile?.city || 'Ahmedabad'}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-glow'
                    : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-xs ${
                      isActive ? 'bg-primary-foreground/20 text-primary-foreground' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Part: Safety Badge & Logout */}
      <div className="space-y-3 pt-6 border-t border-border/80">
        {/* Active Route Quick Indicator if any */}
        {activeCommute && (
          <div className="p-2.5 rounded-xl bg-card border border-border text-[11px] space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Active Commute
            </span>
            <div className="font-bold text-foreground truncate flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="truncate">{activeCommute.start_location} → {activeCommute.destination_location}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-2 text-[11px] text-muted-foreground font-medium">
          <span className="flex items-center gap-1 text-emerald-600 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Trust
          </span>
          <span className="text-[10px]">v1.0</span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* DESKTOP STICKY SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-card border-r border-border sticky top-0 h-screen shrink-0 overflow-y-auto custom-scrollbar z-30">
        <SidebarContent />
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card border-r border-border z-10 shadow-2xl">
            <div className="absolute top-3 right-3">
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 rounded-xl bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* MAIN RIGHT CANVAS */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* TOP APP HEADER */}
        <header className="sticky top-0 z-20 bg-card/85 backdrop-blur-md border-b border-border px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-xl bg-secondary border border-border text-foreground hover:bg-slate-200 transition-all"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumb / Title */}
            <div className="truncate">
              <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight truncate">
                {title || 'Dashboard'}
              </h2>
              {subtitle && (
                <p className="text-[11px] text-muted-foreground font-medium hidden sm:block truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Action CTA */}
            <Link
              to="/create-commute"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold shadow-glow transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Route</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                className="p-2 rounded-xl bg-secondary border border-border text-foreground hover:border-primary/50 transition-all relative"
              >
                <Bell className="w-4 h-4 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-ping" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotificationMenu && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-card border border-border rounded-2xl shadow-2xl p-3 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="text-xs font-bold text-foreground">Notifications</span>
                    <span className="text-[10px] text-primary font-bold">{unreadCount} New</span>
                  </div>
                  <div className="max-h-56 overflow-y-auto py-2 space-y-1.5">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-muted-foreground font-medium">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2 rounded-xl bg-secondary/50 border border-border text-xs space-y-0.5"
                        >
                          <p className="font-bold text-foreground text-[11px]">{n.title || n.message}</p>
                          <span className="text-[9px] text-muted-foreground block">{n.time || 'Just now'}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Header User Profile Icon */}
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-secondary transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-secondary border border-border overflow-hidden flex items-center justify-center shrink-0">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  );
}
