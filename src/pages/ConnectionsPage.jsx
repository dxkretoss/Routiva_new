import React, { useState } from 'react';
import { Users, Clock, CheckCircle2, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import ConnectionCard from '../components/ConnectionCard';
import { useCommute } from '../context/CommuteContext';
import { useAuth } from '../context/AuthContext';

export default function ConnectionsPage() {
  const { user } = useAuth();
  const { connections, loadingConnections } = useCommute();
  const [activeTab, setActiveTab] = useState('all');

  const pendingReceived = connections.filter((c) => c.status === 'pending' && c.to_user === user?.id);
  const sentRequests = connections.filter((c) => c.status === 'pending' && c.from_user === user?.id);
  const acceptedPartners = connections.filter((c) => c.status === 'accepted');
  const rejectedRequests = connections.filter((c) => c.status === 'rejected');

  const getFilteredList = () => {
    switch (activeTab) {
      case 'pending':
        return pendingReceived;
      case 'accepted':
        return acceptedPartners;
      case 'sent':
        return sentRequests;
      case 'rejected':
        return rejectedRequests;
      default:
        return connections;
    }
  };

  const list = getFilteredList();

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Commute Connections & Requests
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
            Manage your daily ride partners, incoming requests, and in-app coordination
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
              activeTab === 'all'
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            All Connections ({connections.length})
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-sm ${
              activeTab === 'pending'
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Incoming Requests ({pendingReceived.length})
          </button>

          <button
            onClick={() => setActiveTab('accepted')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-sm ${
              activeTab === 'accepted'
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Accepted Partners ({acceptedPartners.length})
          </button>

          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-sm ${
              activeTab === 'sent'
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Sent by You ({sentRequests.length})
          </button>
        </div>

        {/* List */}
        {loadingConnections ? (
          <div className="text-center py-12 text-xs text-muted-foreground font-medium">Loading connections...</div>
        ) : list.length === 0 ? (
          <div className="bg-card border border-border rounded-3xl p-10 text-center space-y-3 shadow-card">
            <Users className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="text-sm font-bold text-foreground">No connections in this view</h3>
            <p className="text-xs text-muted-foreground font-medium">
              When you send or receive ride requests, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((conn) => (
              <ConnectionCard key={conn.id} connection={conn} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
