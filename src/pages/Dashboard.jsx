import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Route, 
  Sparkles, 
  Users, 
  PlusCircle, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  Power
} from 'lucide-react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import LeafletRouteMap from '../components/LeafletRouteMap';
import { useCommute } from '../context/CommuteContext';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { profile } = useAuth();
  const { activeCommute, matches, connections, toggleCommuteStatus } = useCommute();

  const pendingRequests = connections.filter((c) => c.status === 'pending');
  const acceptedPartners = connections.filter((c) => c.status === 'accepted');

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        {/* Welcome Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Hello, {profile?.full_name || 'Commuter'}
              </h1>
              {profile?.phone_verified && (
                <ShieldCheck className="w-5 h-5 text-emerald-600" title="Verified Member" />
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
              Ahmedabad ↔ Gandhinagar Daily Route Network
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/create-commute"
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-glow flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Create Commute Route
            </Link>
          </div>
        </div>

        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-muted-foreground font-semibold flex items-center justify-between">
              <span>Active Route</span>
              <Route className="w-4 h-4 text-primary" />
            </div>
            <div className="text-lg sm:text-xl font-black text-foreground mt-2">
              {activeCommute ? `${activeCommute.start_location} → ${activeCommute.destination_location}` : 'None'}
            </div>
            <div className="text-[11px] text-primary font-bold mt-1">
              {activeCommute?.status === 'active' ? '● Searching for matches' : 'Paused'}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-muted-foreground font-semibold flex items-center justify-between">
              <span>Scored Matches</span>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="text-lg sm:text-xl font-black text-primary mt-2">
              {matches.length} Commuters
            </div>
            <Link to="/matches" className="text-[11px] text-muted-foreground hover:text-foreground mt-1 flex items-center gap-0.5 font-medium">
              View ranked list <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-muted-foreground font-semibold flex items-center justify-between">
              <span>Ride Partners</span>
              <Users className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-lg sm:text-xl font-black text-foreground mt-2">
              {acceptedPartners.length} Active
            </div>
            <Link to="/connections" className="text-[11px] text-primary hover:underline mt-1 block font-semibold">
              {pendingRequests.length} Pending requests
            </Link>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-muted-foreground font-semibold flex items-center justify-between">
              <span>Est. Petrol Saved</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-foreground mt-2">
              ₹3,400 / mo
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 font-medium">
              Based on 22 working days
            </div>
          </div>
        </div>

        {/* Active Commute & Route Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          {/* Active Commute Details */}
          <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-secondary px-2.5 py-0.5 rounded border border-border">
                  {activeCommute?.commute_type === 'rider' ? 'Rider Commute' : 'Seeker Commute'}
                </span>
                <h3 className="text-lg font-bold text-foreground mt-1">
                  {activeCommute ? `${activeCommute.start_location} → ${activeCommute.destination_location}` : 'No Commute Created'}
                </h3>
              </div>

              {activeCommute && (
                <button
                  onClick={() => toggleCommuteStatus(activeCommute.id, activeCommute.status === 'active' ? 'paused' : 'active')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all shadow-sm ${
                    activeCommute.status === 'active'
                      ? 'bg-secondary text-primary border-border'
                      : 'bg-muted text-muted-foreground border-border'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  {activeCommute.status === 'active' ? 'Active' : 'Paused'}
                </button>
              )}
            </div>

            {activeCommute ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-secondary/40 p-3 rounded-2xl border border-border">
                    <span className="text-muted-foreground block text-[10px] mb-0.5 font-semibold">Departure Time</span>
                    <span className="font-bold text-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {activeCommute.departure_time}
                    </span>
                  </div>

                  <div className="bg-secondary/40 p-3 rounded-2xl border border-border">
                    <span className="text-muted-foreground block text-[10px] mb-0.5 font-semibold">Commute Days</span>
                    <span className="font-bold text-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {(activeCommute.days || []).join(', ')}
                    </span>
                  </div>

                  <div className="bg-secondary/40 p-3 rounded-2xl border border-border">
                    <span className="text-muted-foreground block text-[10px] mb-0.5 font-semibold">Available Seats</span>
                    <span className="font-bold text-primary flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      {activeCommute.available_seats || 1} Remaining
                    </span>
                  </div>
                </div>

                {/* Sequenced Route Points Strip */}
                {activeCommute.route_points && activeCommute.route_points.length > 0 && (
                  <div className="p-4 rounded-2xl bg-secondary/40 border border-border text-xs">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                      Sequenced Intermediate Stops:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 font-medium">
                      <span className="text-primary font-bold">{activeCommute.start_location}</span>
                      <span className="text-muted-foreground">→</span>
                      {activeCommute.route_points.map((p) => (
                        <React.Fragment key={p.name}>
                          <span className="px-2 py-0.5 rounded bg-card border border-border text-foreground font-semibold shadow-sm">
                            {p.name}
                          </span>
                          <span className="text-muted-foreground">→</span>
                        </React.Fragment>
                      ))}
                      <span className="text-primary font-bold">{activeCommute.destination_location}</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 space-y-3">
                <p className="text-sm text-muted-foreground font-medium">You haven't set up a daily commute route yet.</p>
                <Link
                  to="/create-commute"
                  className="inline-block px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-glow"
                >
                  Create Your Daily Route
                </Link>
              </div>
            )}
          </div>

          {/* Map Preview */}
          <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Route className="w-4 h-4 text-primary" /> Live Transit Corridor
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">Leaflet Map</span>
            </div>

            {activeCommute ? (
              <LeafletRouteMap
                startLocation={activeCommute.start_location}
                destLocation={activeCommute.destination_location}
                routePoints={activeCommute.route_points || []}
                preferredPickups={activeCommute.preferred_route_points?.filter((p) => p.point_type === 'pickup') || []}
                preferredDrops={activeCommute.preferred_route_points?.filter((p) => p.point_type === 'drop') || []}
                height="300px"
              />
            ) : (
              <div className="h-[300px] bg-secondary/40 rounded-2xl flex items-center justify-center text-xs text-muted-foreground font-medium">
                Map will appear when commute is created
              </div>
            )}
          </div>
        </div>

        {/* Top Matches Section */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card mb-12">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Live Compatible Route Matches ({matches.length})
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                Calculated by full route sequence and pickup proximity
              </p>
            </div>

            <Link
              to="/matches"
              className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1"
            >
              View All Matches <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {matches.length === 0 ? (
            <div className="text-center py-10 text-xs text-muted-foreground space-y-2 font-medium">
              <p>Finding commuters traveling your way...</p>
              <p className="text-muted-foreground/80">
                Try increasing your pickup/drop tolerance radius in settings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.slice(0, 2).map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={m.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                        alt="Profile"
                        className="w-10 h-10 rounded-xl object-cover border border-border"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-foreground">{m.profile?.full_name}</h4>
                        <p className="text-[11px] text-muted-foreground font-medium">{m.candidateCommute?.start_location} → {m.candidateCommute?.destination_location}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-primary bg-secondary px-2.5 py-1 rounded-lg border border-border">
                      {m.matchScore}% Match
                    </span>
                  </div>

                  <p className="text-xs text-foreground bg-card p-2.5 rounded-xl border border-border font-medium shadow-sm">
                    {m.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
