import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { invokeEdgeFunction } from '../lib/edgeFunctions';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const CommuteContext = createContext(null);

export function CommuteProvider({ children }) {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [commutes, setCommutes] = useState([]);
  const [activeCommute, setActiveCommute] = useState(null);
  const [matches, setMatches] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loadingCommutes, setLoadingCommutes] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [loadingConnections, setLoadingConnections] = useState(false);

  // 1. Fetch user's commutes
  const fetchUserCommutes = useCallback(async () => {
    if (!user) return;
    setLoadingCommutes(true);
    try {
      const res = await invokeEdgeFunction('get-user-commutes', { userId: user.id });
      if (res.success) {
        setCommutes(res.commutes || []);
        if (res.commutes && res.commutes.length > 0) {
          setActiveCommute(res.commutes[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load user commutes', e);
    } finally {
      setLoadingCommutes(false);
    }
  }, [user]);

  // 2. Fetch matches for active commute
  const fetchMatches = useCallback(async (commuteId) => {
    const targetCommuteId = commuteId || activeCommute?.id;
    if (!targetCommuteId && !user) return;
    setLoadingMatches(true);
    try {
      const res = await invokeEdgeFunction('find-matches', {
        commuteId: targetCommuteId,
        userId: user?.id
      });
      if (res.success) {
        setMatches(res.matches || []);
      }
    } catch (e) {
      console.error('Failed to fetch matches', e);
    } finally {
      setLoadingMatches(false);
    }
  }, [activeCommute, user]);

  // 3. Fetch connections
  const fetchConnections = useCallback(async () => {
    if (!user) return;
    setLoadingConnections(true);
    try {
      const res = await invokeEdgeFunction('get-connections', { userId: user.id });
      if (res.success) {
        setConnections(res.connections || []);
      }
    } catch (e) {
      console.error('Failed to fetch connections', e);
    } finally {
      setLoadingConnections(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserCommutes();
      fetchConnections();
    } else {
      setCommutes([]);
      setActiveCommute(null);
      setMatches([]);
      setConnections([]);
    }
  }, [user, fetchUserCommutes, fetchConnections]);

  useEffect(() => {
    if (activeCommute) {
      fetchMatches(activeCommute.id);
    }
  }, [activeCommute, fetchMatches]);

  // 4. Create new Commute
  const createCommute = async (commuteData) => {
    if (!user) throw new Error('Must be logged in to create a commute.');
    const res = await invokeEdgeFunction('create-commute', {
      userId: user.id,
      commuteData
    });
    if (res.success) {
      addToast('Daily commute created successfully! Searching for matches...', 'success');
      await fetchUserCommutes();
    }
    return res;
  };

  // 5. Update Commute Status (Active / Paused)
  const toggleCommuteStatus = async (commuteId, newStatus) => {
    const res = await invokeEdgeFunction('update-commute-status', { commuteId, status: newStatus });
    if (res.success) {
      setCommutes((prev) =>
        prev.map((c) => (c.id === commuteId ? { ...c, status: newStatus } : c))
      );
      if (activeCommute?.id === commuteId) {
        setActiveCommute((prev) => ({ ...prev, status: newStatus }));
      }
      addToast(`Commute is now ${newStatus}.`, 'info');
    }
    return res;
  };

  // 6. Send Connection Request
  const sendConnectionRequest = async ({ toUserId, toCommuteId, pickupPoint, dropPoint, message }) => {
    if (!user || !activeCommute) {
      throw new Error('Please select or create your commute first.');
    }
    const res = await invokeEdgeFunction('send-connection-request', {
      fromUserId: user.id,
      toUserId,
      fromCommuteId: activeCommute.id,
      toCommuteId,
      pickupPoint,
      dropPoint,
      message
    });
    if (res.success) {
      addToast('Connection request sent to commuter successfully.', 'success');
      fetchConnections();
    }
    return res;
  };

  // 7. Respond to Connection Request (Accept / Reject)
  const respondConnectionRequest = async (connectionId, status) => {
    if (!user) return;
    const res = await invokeEdgeFunction('respond-connection-request', {
      connectionId,
      status,
      userId: user.id
    });
    if (res.success) {
      if (status === 'accepted') {
        addToast('Connection accepted! Ride partner confirmed.', 'success');
      } else {
        addToast('Connection request declined.', 'info');
      }
      fetchConnections();
      fetchUserCommutes(); // Refresh in case available seats decremented
    }
    return res;
  };

  return (
    <CommuteContext.Provider
      value={{
        commutes,
        activeCommute,
        setActiveCommute,
        matches,
        connections,
        loadingCommutes,
        loadingMatches,
        loadingConnections,
        createCommute,
        toggleCommuteStatus,
        sendConnectionRequest,
        respondConnectionRequest,
        refreshMatches: fetchMatches,
        refreshConnections: fetchConnections
      }}
    >
      {children}
    </CommuteContext.Provider>
  );
}

export function useCommute() {
  const context = useContext(CommuteContext);
  if (!context) {
    throw new Error('useCommute must be used within a CommuteProvider');
  }
  return context;
}
