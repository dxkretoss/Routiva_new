import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Car, 
  Calendar, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  User
} from 'lucide-react';
import { useCommute } from '../context/CommuteContext';

export default function MatchResultCard({ match }) {
  const { sendConnectionRequest } = useCommute();
  const [expanded, setExpanded] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const { candidateCommute, profile, vehicle, matchScore, scoreBreakdown, explanation } = match;

  const handleSend = async () => {
    setSending(true);
    try {
      await sendConnectionRequest({
        toUserId: candidateCommute.user_id,
        toCommuteId: candidateCommute.id,
        pickupPoint: scoreBreakdown?.pickupPointName || candidateCommute.start_location,
        dropPoint: scoreBreakdown?.dropPointName || candidateCommute.destination_location,
        message: requestMessage || `Hi ${profile?.full_name}, I saw our commute route overlaps. Would love to share the daily ride!`
      });
      setSent(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-card border border-border hover:border-primary rounded-3xl p-6 transition-all shadow-card relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-border">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-secondary border border-border overflow-hidden flex items-center justify-center">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">{profile?.full_name || 'Commuter'}</h3>
              {profile?.phone_verified && (
                <ShieldCheck className="w-4 h-4 text-emerald-600" title="Verified Commuter" />
              )}
              <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-bold uppercase tracking-wider border border-border">
                {candidateCommute.commute_type}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              {profile?.profession || 'Corporate Professional'} • {profile?.city || 'Ahmedabad'}
            </p>
          </div>
        </div>

        {/* Match Score Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-semibold">Match Score</span>
            <span className="text-lg font-black text-primary flex items-center justify-end gap-1">
              <Sparkles className="w-4 h-4" /> {matchScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Trip Specs */}
      <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Route Info */}
        <div className="bg-secondary/40 rounded-2xl p-3.5 border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-semibold">Their Commute:</span>
            <span className="text-foreground font-bold">
              {candidateCommute.start_location} → {candidateCommute.destination_location}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-semibold">Your Shared Drop:</span>
            <span className="text-primary font-bold">
              {scoreBreakdown?.dropPointName || candidateCommute.destination_location}
            </span>
          </div>

          {vehicle && (
            <div className="pt-2 border-t border-border flex items-center justify-between text-foreground">
              <span className="flex items-center gap-1 font-medium">
                <Car className="w-3.5 h-3.5 text-primary" />
                {vehicle.brand} {vehicle.model}
              </span>
              <span className="font-bold text-primary">
                {candidateCommute.available_seats || vehicle.available_seats} Seats Left
              </span>
            </div>
          )}
        </div>

        {/* Schedule & Contribution */}
        <div className="bg-secondary/40 rounded-2xl p-3.5 border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> Departure:
            </span>
            <span className="text-foreground font-bold">{candidateCommute.departure_time}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-primary" /> Travel Days:
            </span>
            <span className="text-foreground font-semibold">
              {(candidateCommute.days || []).join(', ')}
            </span>
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-muted-foreground font-semibold">Contribution:</span>
            <span className="font-bold text-emerald-600">
              ₹{candidateCommute.contribution_amount || 50} / day
            </span>
          </div>
        </div>
      </div>

      {/* Why Matched Explainer */}
      <div className="p-3 rounded-xl bg-orange-50 border border-primary/30 text-xs text-foreground flex items-start gap-2 font-medium">
        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <span>{explanation}</span>
      </div>

      {/* Collapsible Score Breakdown & Send Action */}
      <div className="mt-4 pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          {expanded ? 'Hide Match Breakdown' : 'View Full Compatibility Metrics'}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {sent ? (
          <span className="px-4 py-2 rounded-xl bg-secondary text-primary font-bold text-xs border border-border flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4" /> Request Sent!
          </span>
        ) : (
          <button
            onClick={handleSend}
            disabled={sending}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-glow flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {sending ? 'Sending...' : 'Send Connection Request'}
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-4 p-4 rounded-2xl bg-secondary/50 border border-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-fadeIn">
          <div>
            <span className="text-muted-foreground block text-[10px] font-semibold">Route Overlap</span>
            <span className="font-bold text-foreground">{scoreBreakdown?.routeCompatibility || 'High'}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px] font-semibold">Pickup Proximity</span>
            <span className="font-bold text-foreground">{scoreBreakdown?.pickupDistanceKm ?? 0} km away</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px] font-semibold">Time Difference</span>
            <span className="font-bold text-foreground">±{scoreBreakdown?.timeDeltaMinutes ?? 5} mins</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px] font-semibold">Days Overlap</span>
            <span className="font-bold text-primary">{scoreBreakdown?.sharedDaysCount ?? 5} Days/Wk</span>
          </div>
        </div>
      )}
    </div>
  );
}
