import React, { useState } from 'react';
import { 
  User, 
  Check, 
  X, 
  MessageSquare, 
  ShieldCheck
} from 'lucide-react';
import { useCommute } from '../context/CommuteContext';
import { useAuth } from '../context/AuthContext';
import ChatModal from './ChatModal';

export default function ConnectionCard({ connection }) {
  const { user } = useAuth();
  const { respondConnectionRequest } = useCommute();
  const [chatOpen, setChatOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const isSender = connection.from_user === user?.id;
  const partnerProfile = isSender ? connection.receiverProfile : connection.senderProfile;

  const handleAction = async (status) => {
    setProcessing(true);
    try {
      await respondConnectionRequest(connection.id, status);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = () => {
    switch (connection.status) {
      case 'accepted':
        return <span className="px-3 py-1 rounded-full bg-secondary text-primary border border-border text-xs font-bold shadow-sm">Accepted Partner</span>;
      case 'rejected':
        return <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold">Declined</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">Pending Response</span>;
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-3xl p-6 transition-all shadow-card relative">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-secondary border border-border overflow-hidden flex items-center justify-center">
              {partnerProfile?.avatar_url ? (
                <img src={partnerProfile.avatar_url} alt="Partner" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">{partnerProfile?.full_name || 'Commuter'}</h3>
                {partnerProfile?.phone_verified && (
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                {partnerProfile?.profession || 'Corporate Professional'} • {partnerProfile?.city || 'Ahmedabad'}
              </p>
            </div>
          </div>

          <div>{getStatusBadge()}</div>
        </div>

        {/* Route Points Coordinate Details */}
        <div className="py-4 space-y-2 text-xs">
          <div className="bg-secondary/40 p-3.5 rounded-2xl border border-border space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-semibold">Pickup Landmark:</span>
              <span className="text-foreground font-bold">{connection.pickup_point || 'Defined Route Hub'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-semibold">Drop Destination:</span>
              <span className="text-primary font-bold">{connection.drop_point || 'Destination'}</span>
            </div>
          </div>

          {connection.message && (
            <div className="p-3 rounded-xl bg-secondary/30 border border-border text-foreground italic">
              "{connection.message}"
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-muted-foreground font-medium">
            {new Date(connection.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>

          <div className="flex items-center gap-2">
            {!isSender && connection.status === 'pending' && (
              <>
                <button
                  onClick={() => handleAction('rejected')}
                  disabled={processing}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs border border-rose-200 flex items-center gap-1 transition-all"
                >
                  <X className="w-3.5 h-3.5" /> Decline
                </button>
                <button
                  onClick={() => handleAction('accepted')}
                  disabled={processing}
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-glow flex items-center gap-1 transition-all"
                >
                  <Check className="w-3.5 h-3.5" /> Accept Connection
                </button>
              </>
            )}

            {connection.status === 'accepted' && (
              <button
                onClick={() => setChatOpen(true)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover font-bold text-xs flex items-center gap-1.5 transition-all shadow-glow"
              >
                <MessageSquare className="w-4 h-4" /> Open In-App Chat
              </button>
            )}
          </div>
        </div>
      </div>

      {chatOpen && (
        <ChatModal
          partnerProfile={partnerProfile}
          conversationId={`conv_${connection.id}`}
          onClose={() => setChatOpen(false)}
        />
      )}
    </>
  );
}
