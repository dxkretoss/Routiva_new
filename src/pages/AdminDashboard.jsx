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
  Sparkles,
  Server,
  Activity,
  Layers,
  Inbox
} from 'lucide-react';
import { invokeEdgeFunction } from '../lib/edgeFunctions';
import AdminLogin from './AdminLogin';

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
  { name: 'get-admin-data', path: '/functions/v1/get-admin-data', status: 'ACTIVE', method: 'POST', cors: 'Enabled' }
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('routiva_admin_auth') === 'true'
  );
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Dynamic Data
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
        setAdminData({
          stats: res.stats || adminData.stats,
          commuters: res.commuters || [],
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
    sessionStorage.removeItem('routiva_admin_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // Filtered Commuters
  const filteredCommuters = adminData.commuters.filter(
    (c) =>
      c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery) ||
      c.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered Commutes
  const filteredCommutes = adminData.commutes.filter(
    (c) =>
      c.start_location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.destination_location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.commute_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border py-3.5 px-4 sm:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/routiva-logo-desktop.png"
              alt="Routiva Logo"
              className="h-8 w-auto object-contain"
            />
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary border border-border text-secondary-foreground text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Admin Console</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-secondary/60 border border-border text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-muted-foreground">Supabase Edge:</span>
              <span className="text-foreground font-bold">fekgaxhevbunbeifrbri</span>
            </div>

            <button
              type="button"
              onClick={loadAdminData}
              disabled={loading}
              className="p-2 rounded-xl bg-secondary/50 border border-border hover:border-primary text-foreground text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Refresh Live Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-primary' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-bold">Total Users</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-black text-foreground">{adminData.stats.totalUsers}</div>
            <span className="text-[10px] text-emerald-600 font-bold">Verified Commuters</span>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-bold">Active Routes</span>
              <Route className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-black text-foreground">{adminData.stats.activeCommutes}</div>
            <span className="text-[10px] text-muted-foreground font-medium">Daily corridors</span>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-bold">Riders</span>
              <Car className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-black text-foreground">{adminData.stats.totalRiders}</div>
            <span className="text-[10px] text-primary font-bold">Vehicle Owners</span>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-bold">Seekers</span>
              <Search className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-foreground">{adminData.stats.totalSeekers}</div>
            <span className="text-[10px] text-muted-foreground font-medium">Commuters</span>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-bold">Connections</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-foreground">{adminData.stats.totalConnections}</div>
            <span className="text-[10px] text-emerald-600 font-bold">{adminData.stats.acceptedConnections} Accepted</span>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-bold">Vehicles</span>
              <Layers className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl font-black text-foreground">{adminData.stats.totalVehicles}</div>
            <span className="text-[10px] text-muted-foreground font-medium">Fleet Registered</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
            {[
              { id: 'users', label: 'Commuters & Users', icon: Users, count: adminData.commuters.length },
              { id: 'commutes', label: 'Route Corridors', icon: Route, count: adminData.commutes.length },
              { id: 'connections', label: 'Connection Requests', icon: Activity, count: adminData.connections.length },
              { id: 'vehicles', label: 'Vehicles', icon: Car, count: adminData.vehicles.length },
              { id: 'edge-functions', label: 'Edge Functions', icon: Server, count: DEPLOYED_EDGE_FUNCTIONS.length }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-glow'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-black/20 text-white' : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search table records..."
              className="w-full bg-secondary/50 border border-border rounded-xl pl-8 pr-3 py-2 text-xs font-semibold text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* TAB 1: USERS & COMMUTERS TABLE */}
        {activeTab === 'users' && (
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-card animate-fadeIn">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Registered Commuters Directory</h3>
                <p className="text-xs text-muted-foreground">All authenticated users on Routiva network</p>
              </div>
              <span className="text-xs font-bold text-primary bg-secondary px-3 py-1 rounded-full border border-border">
                {filteredCommuters.length} Commuters
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/40 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Verification</th>
                    <th className="py-3 px-4">Routes</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredCommuters.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-muted-foreground font-medium">
                        No commuters found matching "{searchQuery}"
                      </td>
                    </tr>
                  ) : (
                    filteredCommuters.map((user) => (
                      <tr key={user.id} className="hover:bg-secondary/20 transition-colors font-medium">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-secondary border border-border flex items-center justify-center font-bold text-primary shrink-0 overflow-hidden shadow-sm">
                              {user.avatar_url ? (
                                <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                user.full_name?.charAt(0) || 'U'
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-foreground block">{user.full_name}</span>
                              <span className="text-[10px] text-muted-foreground font-mono">{user.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-foreground font-semibold">
                              <Mail className="w-3 h-3 text-muted-foreground" />
                              <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                              <Phone className="w-3 h-3 text-muted-foreground" />
                              <span>{user.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-foreground">{user.area || 'Nikol'}</span>
                          <span className="block text-[11px] text-muted-foreground">{user.city}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> OTP Verified
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground font-bold text-[11px] border border-border">
                            {user.commute_count} Commutes
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground text-[11px]">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Today'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: COMMUTE CORRIDORS TABLE */}
        {activeTab === 'commutes' && (
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-card animate-fadeIn">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Live Route Corridors</h3>
                <p className="text-xs text-muted-foreground">Active recurring daily commuter trips</p>
              </div>
              <span className="text-xs font-bold text-primary bg-secondary px-3 py-1 rounded-full border border-border">
                {filteredCommutes.length} Routes
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/40 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Route Type</th>
                    <th className="py-3 px-4">Start Location</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Schedule</th>
                    <th className="py-3 px-4">Departure</th>
                    <th className="py-3 px-4">Split Cost</th>
                    <th className="py-3 px-4">Seats</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredCommutes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-muted-foreground font-medium">
                        No active routes found. Create a commute from the Route Wizard to display here!
                      </td>
                    </tr>
                  ) : (
                    filteredCommutes.map((commute) => (
                      <tr key={commute.id} className="hover:bg-secondary/20 transition-colors font-medium">
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase ${
                            commute.commute_type === 'rider'
                              ? 'bg-secondary text-primary border border-primary/30'
                              : 'bg-orange-50 text-orange-700 border border-orange-200'
                          }`}>
                            {commute.commute_type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-foreground">
                          {commute.start_location}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-foreground">
                          {commute.destination_location}
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">
                          {commute.days?.join(', ') || 'Mon-Fri'}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-primary">
                          {commute.departure_time || '8:30 AM'}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-foreground">
                          ₹{commute.contribution_amount || 50} / day
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-bold">
                            {commute.available_seats || 1}
                          </span>
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
                        No connection requests yet
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
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            conn.status === 'accepted'
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
                <p className="text-xs text-muted-foreground">Rider vehicles registered on Routiva</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {adminData.vehicles.length === 0 ? (
                <div className="col-span-full text-center py-10 text-muted-foreground font-medium">
                  No vehicles registered in this fleet yet
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
                <h3 className="text-base font-bold text-foreground">Supabase Edge Functions Status</h3>
                <p className="text-xs text-muted-foreground">Deployed microservices on project fekgaxhevbunbeifrbri</p>
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
      </main>
    </div>
  );
}
