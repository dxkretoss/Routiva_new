import React, { useState, useEffect } from 'react';
import {
  Users,
  Car,
  MapPin,
  Route,
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Server,
  Activity,
  Layers,
  Inbox,
  User,
  Briefcase,
  Building,
  Navigation,
  Eye,
  X,
  Menu,
  Check,
  Fuel,
  TrendingUp,
  ArrowRight,
  Shield,
  Filter,
  ExternalLink
} from 'lucide-react';
import { invokeEdgeFunction } from '../lib/edgeFunctions';
import AdminLogin from './AdminLogin';
import LeafletRouteMap from '../components/LeafletRouteMap';

const DEPLOYED_EDGE_FUNCTIONS = [
  { name: 'auth-register', path: '/functions/v1/auth-register', status: 'ACTIVE', method: 'POST', cors: 'Enabled' },
  { name: 'auth-verify-otp', path: '/functions/v1/auth-verify-otp', status: 'ACTIVE', method: 'POST', cors: 'Enabled' },
  { name: 'auth-login', path: '/functions/v1/auth-login', status: 'ACTIVE', method: 'POST', cors: 'Enabled' },
  { name: 'get-notifications', path: '/functions/v1/get-notifications', status: 'ACTIVE', method: 'POST', cors: 'Enabled' },
  { name: 'find-matches', path: '/functions/v1/find-matches', status: 'ACTIVE', method: 'POST', cors: 'Enabled' },
  { name: 'get-user-commutes', path: '/functions/v1/get-user-commutes', status: 'ACTIVE', method: 'POST', cors: 'Enabled' },
  { name: 'get-connections', path: '/functions/v1/get-connections', status: 'ACTIVE', method: 'POST', cors: 'Enabled' },
  { name: 'create-commute', path: '/functions/v1/create-commute', status: 'ACTIVE', method: 'POST', cors: 'Enabled' },
  { name: 'update-profile', path: '/functions/v1/update-profile', status: 'ACTIVE', method: 'POST', cors: 'Enabled' },
  { name: 'upload-image', path: '/functions/v1/upload-image', status: 'ACTIVE', method: 'POST', cors: 'Enabled' },
  { name: 'get-admin-data', path: '/functions/v1/get-admin-data', status: 'ACTIVE', method: 'POST', cors: 'Enabled' },
  { name: 'admin-login', path: '/functions/v1/admin-login', status: 'ACTIVE', method: 'POST', cors: 'Enabled' }
];

const checkAdminAuth = () => {
  try {
    const raw = localStorage.getItem('routiva_admin_auth') || sessionStorage.getItem('routiva_admin_auth');
    if (!raw) return false;
    if (raw === 'true') return true;
    const parsed = JSON.parse(raw);
    return Boolean(parsed?.token && (parsed?.role === 'super_admin' || parsed?.role === 'admin'));
  } catch {
    return false;
  }
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(checkAdminAuth());
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'commutes' | 'connections' | 'vehicles' | 'edge-functions' | 'inquiries'
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState('all'); // 'all' | 'riders' | 'seekers' | 'has-routes'
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Selected User Modal for Deep-Dive Details
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [selectedCommuteModal, setSelectedCommuteModal] = useState(null);

  // Dynamic Admin Data
  const [adminData, setAdminData] = useState({
    stats: {
      totalUsers: 0,
      activeCommutes: 0,
      totalRiders: 0,
      totalSeekers: 0,
      totalConnections: 0,
      acceptedConnections: 0,
      totalVehicles: 0,
      totalInquiries: 0
    },
    commuters: [],
    commutes: [],
    connections: [],
    vehicles: [],
    contacts: []
  });

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const res = await invokeEdgeFunction('get-admin-data');
      if (res?.success) {
        const commuters = res.commuters || [];
        setAdminData({
          stats: res.stats || adminData.stats,
          commuters: commuters,
          commutes: res.commutes || [],
          connections: res.connections || [],
          vehicles: res.vehicles || [],
          contacts: res.contacts || []
        });
      }
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('routiva_admin_auth');
    sessionStorage.removeItem('routiva_admin_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // Helpers
  const getUserCommutes = (userId) => {
    return adminData.commutes.filter((c) => c.user_id === userId);
  };

  const getUserVehicle = (userId) => {
    return adminData.vehicles.find((v) => v.user_id === userId);
  };

  const getUserConnections = (userId) => {
    return adminData.connections.filter((c) => c.seeker_id === userId || c.rider_id === userId);
  };

  // Filtered Commuters
  const filteredCommuters = adminData.commuters.filter((c) => {
    const matchesSearch =
      c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery) ||
      c.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.profession?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const userCommutes = getUserCommutes(c.id);
    const hasRiderCommute = userCommutes.some((cm) => cm.commute_type === 'rider') || c.role === 'rider';

    if (userFilter === 'riders') return hasRiderCommute;
    if (userFilter === 'seekers') return !hasRiderCommute;
    if (userFilter === 'has-routes') return userCommutes.length > 0;
    return true;
  });

  // Filtered Commutes
  const filteredCommutes = adminData.commutes.filter(
    (c) =>
      c.start_location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.destination_location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.commute_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navTabs = [
    { id: 'users', label: 'Commuters & Routes', icon: Users, count: adminData.commuters.length, badge: 'Main' },
    { id: 'commutes', label: 'All Route Corridors', icon: Route, count: adminData.commutes.length },
    { id: 'connections', label: 'Connections & Rides', icon: Activity, count: adminData.connections.length },
    { id: 'vehicles', label: 'Vehicles & Fleet', icon: Car, count: adminData.vehicles.length },
    { id: 'edge-functions', label: 'Edge Microservices', icon: Server, count: DEPLOYED_EDGE_FUNCTIONS.length },
    { id: 'inquiries', label: 'Inquiries & Contacts', icon: Inbox, count: adminData.contacts.length }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 select-none">
      {/* Top Part: Logo */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-border">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/images/routiva-logo-desktop.png"
              alt="Routiva Logo"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>

        {/* Admin Navigation Links */}
        <nav className="space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Control Center
          </div>
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive
                    ? 'bg-primary text-primary-foreground shadow-glow'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                  <span className="truncate">{tab.label}</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${isActive
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground border border-border'
                    }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Part: Logout Button */}
      <div className="pt-4 border-t border-border">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* DESKTOP ADMIN SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border sticky top-0 h-screen shrink-0 overflow-y-auto custom-scrollbar z-30">
        <SidebarContent />
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card border-r border-border z-10 shadow-2xl">
            <div className="absolute top-3 right-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
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
        {/* TOP ADMIN HEADER */}
        <header className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b border-border px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-secondary border border-border text-foreground hover:bg-slate-200"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div>
              <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                <span>Routiva Admin Console</span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-secondary border border-border text-[10px] text-primary font-bold">
                  {navTabs.find((t) => t.id === activeTab)?.label}
                </span>
              </h2>
            </div>
          </div>

          {/* Search + Action Controls */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-40 sm:w-64">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user, route, area..."
                className="w-full bg-secondary/50 border border-border rounded-xl pl-8 pr-3 py-1.5 text-xs font-semibold text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="button"
              onClick={loadAdminData}
              disabled={loading}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-secondary border border-border hover:border-primary text-foreground text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shrink-0"
              title="Refresh Live Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-primary' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6 animate-fadeIn">
          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between text-muted-foreground mb-1.5">
                <span className="text-[11px] font-bold">Total Users</span>
                <Users className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-foreground">{adminData.stats.totalUsers}</div>
              <span className="text-[10px] text-emerald-600 font-bold">Verified Commuters</span>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between text-muted-foreground mb-1.5">
                <span className="text-[11px] font-bold">Corridors</span>
                <Route className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-foreground">{adminData.stats.activeCommutes}</div>
              <span className="text-[10px] text-muted-foreground font-medium">Daily Active Routes</span>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between text-muted-foreground mb-1.5">
                <span className="text-[11px] font-bold">Riders</span>
                <Car className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-foreground">{adminData.stats.totalRiders}</div>
              <span className="text-[10px] text-primary font-bold">Vehicle Owners</span>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between text-muted-foreground mb-1.5">
                <span className="text-[11px] font-bold">Seekers</span>
                <Search className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-foreground">{adminData.stats.totalSeekers}</div>
              <span className="text-[10px] text-muted-foreground font-medium">Daily Commuters</span>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between text-muted-foreground mb-1.5">
                <span className="text-[11px] font-bold">Connections</span>
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-foreground">{adminData.stats.totalConnections}</div>
              <span className="text-[10px] text-emerald-600 font-bold">{adminData.stats.acceptedConnections} Accepted</span>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between text-muted-foreground mb-1.5">
                <span className="text-[11px] font-bold">Fleet Size</span>
                <Layers className="w-3.5 h-3.5 text-sky-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-foreground">{adminData.stats.totalVehicles}</div>
              <span className="text-[10px] text-muted-foreground font-medium">Cars & 2-Wheelers</span>
            </div>
          </div>

          {/* TAB 1: COMMUTERS DIRECTORY TABLE & VIEW DETAILS */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Filter Bar with Dropdown */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-card border border-border rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-primary" /> Filter Users:
                  </span>
                  <div className="relative">
                    <select
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="appearance-none bg-secondary/80 hover:bg-secondary border border-border focus:border-primary rounded-xl pl-3 pr-8 py-1.5 text-xs font-bold text-foreground cursor-pointer transition-all outline-none"
                    >
                      <option value="all">All Users ({adminData.commuters.length})</option>
                      <option value="riders">Vehicle Owners ({adminData.stats.totalRiders})</option>
                      <option value="seekers">Seekers ({adminData.stats.totalSeekers})</option>
                      <option value="has-routes">With Active Routes ({adminData.commuters.filter(c => getUserCommutes(c.id).length > 0).length})</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <span className="text-xs font-bold text-muted-foreground px-2">
                  Showing {filteredCommuters.length} Commuters
                </span>
              </div>

              {/* Commuters Table */}
              <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-card animate-fadeIn">
                <div className="p-5 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground">Registered Commuters Directory</h3>
                    <p className="text-xs text-muted-foreground font-medium">Manage all platform commuters, vehicle owners, and daily ride seekers</p>
                  </div>
                  <span className="text-xs font-bold text-primary bg-secondary px-3 py-1 rounded-full border border-border">
                    {filteredCommuters.length} Commuters
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-secondary/40 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                      <tr>
                        <th className="py-3.5 px-4">Commuter</th>
                        <th className="py-3.5 px-4">Role / Type</th>
                        <th className="py-3.5 px-4">Location & Profession</th>
                        <th className="py-3.5 px-4">Phone / OTP</th>
                        <th className="py-3.5 px-4">Routes & Vehicle</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredCommuters.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-muted-foreground font-medium">
                            <Users className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                            No commuters found matching query "{searchQuery}"
                          </td>
                        </tr>
                      ) : (
                        filteredCommuters.map((user) => {
                          const userCommutes = getUserCommutes(user.id);
                          const userVehicle = getUserVehicle(user.id);
                          const isRider = userCommutes.some((cm) => cm.commute_type === 'rider') || user.role === 'rider' || Boolean(userVehicle);

                          return (
                            <tr
                              key={user.id}
                              onClick={() => setSelectedUserDetails(user)}
                              className="hover:bg-secondary/30 transition-colors cursor-pointer font-medium"
                            >
                              {/* Commuter Avatar & Identity */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-secondary text-primary border border-border flex items-center justify-center font-black text-xs shrink-0 overflow-hidden shadow-xs">
                                    {user.avatar_url ? (
                                      <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      user.full_name?.charAt(0) || 'U'
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-foreground truncate">{user.full_name}</h4>
                                    <p className="text-[11px] text-muted-foreground font-mono truncate max-w-[180px]">{user.email}</p>
                                  </div>
                                </div>
                              </td>

                              {/* Role / Type */}
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase ${isRider
                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                    : 'bg-orange-50 text-orange-800 border border-orange-200'
                                  }`}>
                                  {isRider ? '🚗 Rider / Owner' : '🚶 Seeker'}
                                </span>
                              </td>

                              {/* Location & Profession */}
                              <td className="py-3.5 px-4">
                                <div className="space-y-0.5">
                                  <div className="text-foreground font-semibold flex items-center gap-1 truncate">
                                    <MapPin className="w-3 h-3 text-primary shrink-0" />
                                    <span>{user.area || 'Nikol'}, {user.city || 'Ahmedabad'}</span>
                                  </div>
                                  <div className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                                    <Briefcase className="w-3 h-3 text-muted-foreground shrink-0" />
                                    <span>{user.profession || 'Corporate Professional'}{user.company ? ` • ${user.company}` : ''}</span>
                                  </div>
                                </div>
                              </td>

                              {/* Phone / OTP */}
                              <td className="py-3.5 px-4">
                                <div className="space-y-0.5">
                                  <div className="text-foreground font-semibold">{user.phone || 'Not Provided'}</div>
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                    <Check className="w-3 h-3" /> OTP Verified
                                  </span>
                                </div>
                              </td>

                              {/* Routes & Vehicle */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="px-2 py-0.5 rounded-lg bg-secondary text-foreground text-[10px] font-bold border border-border">
                                    {userCommutes.length} {userCommutes.length === 1 ? 'Route' : 'Routes'}
                                  </span>
                                  {userVehicle && (
                                    <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold border border-primary/20 flex items-center gap-1">
                                      <Car className="w-3 h-3" />
                                      <span>{userVehicle.brand} {userVehicle.model}</span>
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Action: View Details */}
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUserDetails(user);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ml-auto"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>View Details</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROUTE CORRIDORS TABLE */}
          {activeTab === 'commutes' && (
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-card animate-fadeIn">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">Live Route Corridors Explorer</h3>
                  <p className="text-xs text-muted-foreground font-medium">All active commuter transit corridors in Ahmedabad & Gandhinagar</p>
                </div>
                <span className="text-xs font-bold text-primary bg-secondary px-3 py-1 rounded-full border border-border">
                  {filteredCommutes.length} Corridors
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/40 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                    <tr>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Origin & Destination</th>
                      <th className="py-3 px-4">Waypoints / Stops</th>
                      <th className="py-3 px-4">Days</th>
                      <th className="py-3 px-4">Departure</th>
                      <th className="py-3 px-4">Split Cost</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredCommutes.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-muted-foreground font-medium">
                          No active route corridors found
                        </td>
                      </tr>
                    ) : (
                      filteredCommutes.map((commute) => (
                        <tr
                          key={commute.id}
                          onClick={() => setSelectedCommuteModal(commute)}
                          className="hover:bg-secondary/30 transition-colors cursor-pointer font-medium"
                        >
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase ${commute.commute_type === 'rider'
                                ? 'bg-secondary text-primary border border-primary/30'
                                : 'bg-orange-50 text-orange-700 border border-orange-200'
                              }`}>
                              {commute.commute_type}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-bold text-foreground block">
                              {commute.start_location} → {commute.destination_location}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {commute.user_id ? `User: ${commute.user_id.substring(0, 8)}...` : ''}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-lg bg-secondary text-foreground text-[10px] font-bold border border-border">
                              {commute.route_points?.length || 0} stops
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-muted-foreground text-[11px]">
                            {commute.days?.join(', ') || 'Mon-Fri'}
                          </td>

                          <td className="py-3.5 px-4 font-bold text-primary">
                            {commute.departure_time || '8:30 AM'}
                          </td>

                          <td className="py-3.5 px-4 font-bold text-foreground">
                            ₹{commute.contribution_amount || 50} / day
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCommuteModal(commute);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-bold transition-all shadow-xs"
                            >
                              Inspect Map
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CONNECTION REQUESTS TABLE */}
          {activeTab === 'connections' && (
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-card animate-fadeIn">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">Commute Connection Requests</h3>
                  <p className="text-xs text-muted-foreground">Ride partner matching & shared trip requests</p>
                </div>
                <span className="text-xs font-bold text-primary bg-secondary px-3 py-1 rounded-full border border-border">
                  {adminData.connections.length} Requests
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/40 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                    <tr>
                      <th className="py-3 px-4">Request ID</th>
                      <th className="py-3 px-4">Pickup Point</th>
                      <th className="py-3 px-4">Drop Point</th>
                      <th className="py-3 px-4">Message Note</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {adminData.connections.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-muted-foreground font-medium">
                          No connection requests recorded yet
                        </td>
                      </tr>
                    ) : (
                      adminData.connections.map((conn) => (
                        <tr key={conn.id} className="hover:bg-secondary/20 transition-colors font-medium">
                          <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                            {conn.id}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-foreground">
                            {conn.pickup_point}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-foreground">
                            {conn.drop_point}
                          </td>
                          <td className="py-3.5 px-4 text-muted-foreground max-w-xs truncate">
                            {conn.message}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${conn.status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                              }`}>
                              {conn.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-muted-foreground text-[11px]">
                            {new Date(conn.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: VEHICLES DIRECTORY */}
          {activeTab === 'vehicles' && (
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-card animate-fadeIn">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">Registered Commuter Vehicles</h3>
                  <p className="text-xs text-muted-foreground">Rider vehicle fleet active on Routiva</p>
                </div>
                <span className="text-xs font-bold text-primary bg-secondary px-3 py-1 rounded-full border border-border">
                  {adminData.vehicles.length} Vehicles
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {adminData.vehicles.length === 0 ? (
                  <div className="col-span-full text-center py-10 text-muted-foreground font-medium">
                    No vehicles registered yet
                  </div>
                ) : (
                  adminData.vehicles.map((v, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{v.brand} {v.model}</span>
                        <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-card font-bold border border-border text-primary">
                          {v.vehicle_type}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Plate: <strong className="text-foreground">{v.registration_number || v.license_plate}</strong></div>
                        <div>Colour: <strong className="text-foreground">{v.colour || v.color}</strong></div>
                        <div>Available Seats: <strong className="text-foreground">{v.available_seats}</strong></div>
                        <div>Fuel Type: <strong className="text-foreground">{v.fuel_type || 'Petrol'}</strong></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: EDGE FUNCTIONS MONITOR */}
          {activeTab === 'edge-functions' && (
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-card animate-fadeIn">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">Supabase Edge Microservices</h3>
                  <p className="text-xs text-muted-foreground">12 deployed backend functions on cluster fekgaxhevbunbeifrbri</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  100% Operational
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/40 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                    <tr>
                      <th className="py-3 px-4">Function Name</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Endpoint Path</th>
                      <th className="py-3 px-4">CORS</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {DEPLOYED_EDGE_FUNCTIONS.map((fn) => (
                      <tr key={fn.name} className="hover:bg-secondary/20 transition-colors font-medium">
                        <td className="py-3.5 px-4 font-bold text-foreground flex items-center gap-2">
                          <Server className="w-3.5 h-3.5 text-primary" />
                          <span>{fn.name}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-mono text-[10px] font-bold">
                            {fn.method}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                          {fn.path}
                        </td>
                        <td className="py-3.5 px-4 text-emerald-600 font-bold text-[11px]">
                          ✓ {fn.cors}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {fn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: INQUIRIES & CONTACTS */}
          {activeTab === 'inquiries' && (
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-card animate-fadeIn">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">User Inquiries & Messages</h3>
                  <p className="text-xs text-muted-foreground">Contact form submissions from commuters</p>
                </div>
                <span className="text-xs font-bold text-primary bg-secondary px-3 py-1 rounded-full border border-border">
                  {adminData.contacts.length} Messages
                </span>
              </div>

              <div className="p-6 space-y-4">
                {adminData.contacts.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground font-medium text-xs">
                    No contact form inquiries submitted yet
                  </div>
                ) : (
                  adminData.contacts.map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{c.name} ({c.email})</span>
                        <span className="text-[10px] text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-foreground bg-card p-3 rounded-xl border border-border">{c.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* FULL COMMUTER DEEP-DIVE DETAILS MODAL */}
      {selectedUserDetails && (() => {
        const userCommutes = getUserCommutes(selectedUserDetails.id);
        const userVehicle = getUserVehicle(selectedUserDetails.id);
        const userConnections = getUserConnections(selectedUserDetails.id);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-4xl bg-card border border-border rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 space-y-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-sm shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-foreground">
                      Commuter Full Profile & Routes
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      Detailed account telemetry and registered daily commute corridors
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUserDetails(null)}
                  className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-all"
                  title="Close Details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. Profile Header Card */}
              <div className="p-5 rounded-2xl bg-secondary/30 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-secondary border-2 border-primary/40 flex items-center justify-center font-black text-2xl text-primary shrink-0 overflow-hidden shadow-md">
                    {selectedUserDetails.avatar_url ? (
                      <img src={selectedUserDetails.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      selectedUserDetails.full_name?.charAt(0) || 'U'
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-black text-foreground">
                        {selectedUserDetails.full_name}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Account
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase">
                        {selectedUserDetails.role || (userVehicle ? 'Rider' : 'Seeker')}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground font-medium flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-primary" />
                        {selectedUserDetails.profession || 'Corporate Professional'}
                      </span>
                      {selectedUserDetails.company && (
                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-primary" />
                          {selectedUserDetails.company}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {selectedUserDetails.area || 'Nikol'}, {selectedUserDetails.city || 'Ahmedabad'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Contact Chips */}
                <div className="flex flex-col sm:items-end gap-1.5 text-xs text-muted-foreground w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    <span>{selectedUserDetails.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>{selectedUserDetails.phone || '+91 Not Provided'}</span>
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    ID: {selectedUserDetails.id}
                  </div>
                </div>
              </div>

              {/* 2. Key Profile Information Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Residential Area
                  </span>
                  <span className="text-xs font-bold text-foreground truncate block">
                    {selectedUserDetails.area || 'Nikol, Ahmedabad'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Office / Work Hub
                  </span>
                  <span className="text-xs font-bold text-foreground truncate block">
                    {selectedUserDetails.company || 'SG Highway / GIFT City'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Auth Phone OTP
                  </span>
                  <span className="text-xs font-bold text-emerald-600 truncate block flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Registered Corridors
                  </span>
                  <span className="text-xs font-black text-primary block">
                    {userCommutes.length} Corridors
                  </span>
                </div>
              </div>

              {/* 3. Registered Commute Routes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div>
                    <h4 className="text-sm font-black text-foreground flex items-center gap-2">
                      <Route className="w-4 h-4 text-primary" />
                      <span>Registered Commute Routes ({userCommutes.length})</span>
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      All origin-to-destination corridors and intermediate stops published by {selectedUserDetails.full_name}
                    </p>
                  </div>
                </div>

                {userCommutes.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-secondary/20 border border-dashed border-border text-center space-y-2">
                    <Route className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                    <h5 className="text-xs font-bold text-foreground">No Commute Route Published</h5>
                    <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                      This commuter has completed account setup but has not yet created a regular daily commute route.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {userCommutes.map((commute, idx) => (
                      <div
                        key={commute.id || idx}
                        className="p-5 rounded-2xl bg-secondary/30 border border-border space-y-4 shadow-sm"
                      >
                        {/* Route Card Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${commute.commute_type === 'rider'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-orange-100 text-orange-800'
                                }`}>
                                {commute.commute_type === 'rider' ? '🚗 Vehicle Owner / Driver' : '🚶 Passenger / Seeker'}
                              </span>
                              <span className="text-xs font-black text-foreground">
                                Route #{idx + 1}
                              </span>
                            </div>
                            <div className="text-sm font-black text-foreground flex items-center gap-2 flex-wrap">
                              <span className="text-primary">{commute.start_location}</span>
                              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                              <span className="text-primary">{commute.destination_location}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-xs font-black text-foreground">₹{commute.contribution_amount || 50} / day</div>
                              <div className="text-[10px] text-muted-foreground">Fuel Cost Split</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedCommuteModal(commute)}
                              className="px-3 py-1.5 rounded-xl bg-card hover:bg-primary hover:text-primary-foreground border border-border text-foreground text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Full Map</span>
                            </button>
                          </div>
                        </div>

                        {/* Route Key Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="p-2.5 rounded-xl bg-card border border-border space-y-0.5">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase flex items-center gap-1">
                              <Clock className="w-3 h-3 text-primary" /> Departure Time
                            </span>
                            <span className="font-black text-foreground">{commute.departure_time || '8:30 AM'}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-card border border-border space-y-0.5">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-primary" /> Schedule Days
                            </span>
                            <span className="font-bold text-foreground truncate block">
                              {commute.days?.join(', ') || 'Mon, Tue, Wed, Thu, Fri'}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-card border border-border space-y-0.5">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase flex items-center gap-1">
                              <Car className="w-3 h-3 text-primary" /> Available Seats
                            </span>
                            <span className="font-black text-foreground">{commute.available_seats || 3} Seats</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-card border border-border space-y-0.5">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase flex items-center gap-1">
                              <Navigation className="w-3 h-3 text-primary" /> Intermediate Stops
                            </span>
                            <span className="font-black text-foreground">{commute.route_points?.length || 0} Stops</span>
                          </div>
                        </div>

                        {/* Sequenced Stops */}
                        {commute.route_points && commute.route_points.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                              Stop Sequence Along Corridor:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {commute.route_points.map((pt, pIdx) => (
                                <span
                                  key={pIdx}
                                  className="px-2.5 py-1 rounded-xl bg-card border border-border text-[11px] font-semibold text-foreground flex items-center gap-1.5 shadow-xs"
                                >
                                  <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center">
                                    {pIdx + 1}
                                  </span>
                                  <span>{pt.name}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Embedded Route Map */}
                        <div className="rounded-2xl overflow-hidden border border-border h-48 shadow-inner relative">
                          <LeafletRouteMap
                            startLocation={commute.start_location}
                            destinationLocation={commute.destination_location}
                            routePoints={commute.route_points || []}
                            preferredPoints={commute.preferred_route_points || []}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Registered Vehicle Details */}
              {userVehicle && (
                <div className="p-5 rounded-2xl bg-secondary/30 border border-border space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border/80">
                    <h4 className="text-xs font-black text-foreground flex items-center gap-2">
                      <Car className="w-4 h-4 text-primary" />
                      <span>Registered Commuter Vehicle</span>
                    </h4>
                    <span className="text-[10px] font-bold text-primary uppercase bg-card px-2 py-0.5 rounded border border-border">
                      {userVehicle.vehicle_type || 'Car'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-card border border-border">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase block">Brand & Model</span>
                      <span className="font-black text-foreground">{userVehicle.brand} {userVehicle.model}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-card border border-border">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase block">Plate Number</span>
                      <span className="font-black text-foreground font-mono">{userVehicle.registration_number || userVehicle.license_plate}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-card border border-border">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase block">Color & Fuel</span>
                      <span className="font-bold text-foreground">{userVehicle.colour || userVehicle.color || 'White'} • {userVehicle.fuel_type || 'Petrol'}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-card border border-border">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase block">Capacity</span>
                      <span className="font-black text-foreground">{userVehicle.available_seats} Passenger Seats</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. User Connections & Rides History */}
              {userConnections.length > 0 && (
                <div className="p-5 rounded-2xl bg-secondary/30 border border-border space-y-3">
                  <h4 className="text-xs font-black text-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span>Ride Connections ({userConnections.length})</span>
                  </h4>

                  <div className="space-y-2">
                    {userConnections.map((conn) => (
                      <div key={conn.id} className="p-3 rounded-xl bg-card border border-border flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-foreground">{conn.pickup_point} → {conn.drop_point}</div>
                          <div className="text-[10px] text-muted-foreground">{conn.message || 'Ride sharing connection'}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${conn.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                          {conn.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* FULL COMMUTE CORRIDOR INSPECTION MODAL */}
      {selectedCommuteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-card border border-border rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-lg font-black text-foreground">
                  Corridor Inspection: {selectedCommuteModal.start_location} → {selectedCommuteModal.destination_location}
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  {selectedCommuteModal.commute_type === 'rider' ? 'Vehicle Owner Corridor' : 'Seeker Corridor'} • ₹{selectedCommuteModal.contribution_amount || 50}/day
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCommuteModal(null)}
                className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Map Preview */}
            <div className="rounded-2xl overflow-hidden border border-border h-72 shadow-inner">
              <LeafletRouteMap
                startLocation={selectedCommuteModal.start_location}
                destinationLocation={selectedCommuteModal.destination_location}
                routePoints={selectedCommuteModal.route_points || []}
                preferredPoints={selectedCommuteModal.preferred_route_points || []}
              />
            </div>

            {/* Stop Sequence Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground block">
                Intermediate Waypoint Sequence ({selectedCommuteModal.route_points?.length || 0} stops):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCommuteModal.route_points?.map((pt, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-xl bg-secondary border border-border text-xs font-semibold text-foreground flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span>{pt.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
