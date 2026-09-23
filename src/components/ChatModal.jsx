import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, ShieldCheck } from 'lucide-react';
import { invokeEdgeFunction } from '../lib/edgeFunctions';
import { useAuth } from '../context/AuthContext';

export default function ChatModal({ partnerProfile, conversationId, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await invokeEdgeFunction('get-messages', { conversationId });
      if (res.success) {
        setMessages(res.messages || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      const res = await invokeEdgeFunction('send-message', {
        conversationId,
        senderId: user.id,
        message: newMessage.trim()
      });
      if (res.success) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl w-full max-w-lg h-[580px] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 bg-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-card border border-border overflow-hidden flex items-center justify-center shadow-sm">
              {partnerProfile?.avatar_url ? (
                <img src={partnerProfile.avatar_url} alt="Partner" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                {partnerProfile?.full_name || 'Commuter'}
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </h3>
              <span className="text-[10px] text-primary font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Connected Commute Partner
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-card transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-background">
          {messages.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-10 font-medium">
              No messages yet. Say hello and coordinate your daily pickup point!
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed font-medium ${
                      isMine
                        ? 'bg-primary text-primary-foreground font-semibold rounded-br-none shadow-sm'
                        : 'bg-card text-foreground border border-border rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p>{msg.message}</p>
                    <span
                      className={`text-[9px] block mt-1 ${
                        isMine ? 'text-primary-foreground/80' : 'text-muted-foreground'
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-card border-t border-border flex gap-2">
          <input
            type="text"
            placeholder="Type coordination message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs rounded-xl shadow-glow flex items-center justify-center transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
