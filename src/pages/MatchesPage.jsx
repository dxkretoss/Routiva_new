import React, { useState } from 'react';
import { RefreshCw, Route, Info } from 'lucide-react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import MatchResultCard from '../components/MatchResultCard';
import { useCommute } from '../context/CommuteContext';

export default function MatchesPage() {
  const { matches, activeCommute, loadingMatches, refreshMatches } = useCommute();
  const [minScore] = useState(60);

  const filteredMatches = matches.filter((m) => m.matchScore >= minScore);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider border border-border">
                Route Matching Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
              Live Compatible Commute Partners
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
              Matching for: <strong className="text-foreground">{activeCommute ? `${activeCommute.start_location} → ${activeCommute.destination_location}` : 'Default Route'}</strong>
            </p>
          </div>

          <button
            onClick={() => refreshMatches(activeCommute?.id)}
            disabled={loadingMatches}
            className="px-4 py-2 rounded-xl bg-card border border-border hover:border-primary text-xs font-bold text-foreground flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingMatches ? 'animate-spin text-primary' : ''}`} />
            Refresh Algorithm
          </button>
        </div>

        {/* Informational Banner on Partial Matching */}
        <div className="p-4 rounded-2xl bg-orange-50 border border-primary/30 text-xs text-foreground mb-8 flex items-start gap-3 shadow-sm">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="font-medium">
            <strong>Core Matching Principle:</strong> You are matched if your journey overlaps the Rider's full route. 
            The Rider does not need to have the same destination as you — you will be dropped off at your designated stop along their path!
          </p>
        </div>

        {/* Results Stream */}
        {loadingMatches ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-muted-foreground font-medium">Evaluating sequenced route coordinates & proximity...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="bg-card border border-border rounded-3xl p-10 text-center space-y-3 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center mx-auto text-primary">
              <Route className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No Direct Matches Found Right Now</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto font-medium">
              We couldn't find a partner along your exact corridor at this moment. 
              Try expanding your time flexibility or pickup tolerance in your commute settings.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredMatches.map((m, idx) => (
              <MatchResultCard key={idx} match={m} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
