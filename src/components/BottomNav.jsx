import React from 'react';
import { NavLink } from 'react-router-dom';
import { Route, Sparkles, Users, User, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border px-4 py-2 flex items-center justify-around text-xs shadow-lg">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            isActive ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
          }`
        }
      >
        <Route className="w-5 h-5" />
        <span className="text-[10px]">Dashboard</span>
      </NavLink>

      <NavLink
        to="/matches"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            isActive ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
          }`
        }
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-[10px]">Matches</span>
      </NavLink>

      <NavLink
        to="/create-commute"
        className="flex flex-col items-center gap-1 py-1 px-2.5 text-primary font-bold"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center -mt-4 shadow-glow">
          <PlusCircle className="w-5 h-5" />
        </div>
        <span className="text-[10px]">New Route</span>
      </NavLink>

      <NavLink
        to="/connections"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            isActive ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
          }`
        }
      >
        <Users className="w-5 h-5" />
        <span className="text-[10px]">Partners</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            isActive ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
          }`
        }
      >
        <User className="w-5 h-5" />
        <span className="text-[10px]">Profile</span>
      </NavLink>
    </nav>
  );
}
