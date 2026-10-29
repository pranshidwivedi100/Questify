import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Flame, Zap, Shield, LogOut, Swords } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, progress, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const level = progress?.currentLevel || user?.progress?.currentLevel || 1;
  const streak = progress?.currentStreak || user?.progress?.currentStreak || 0;
  const totalXp = progress?.totalXp || user?.progress?.totalXp || 0;

  return (
    <header className="h-16 border-b border-quest-border bg-quest-surface/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-quest-purple to-quest-cyan p-0.5 shadow-glow-purple flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-quest-bg rounded-[10px] flex items-center justify-center">
              <Swords className="w-5 h-5 text-quest-purple group-hover:text-quest-cyan transition-colors" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
              QUESTIFY
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 border border-slate-700/60 rounded px-1.5 py-0.5 bg-slate-800/40">
              RPG Planner
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>{streak} {streak === 1 ? 'Day' : 'Days'}</span>
        </div>

        {/* Level Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-quest-purple/15 border border-quest-purple/40 text-purple-300 text-xs font-bold shadow-glow-purple">
          <Shield className="w-4 h-4 text-quest-purple-light" />
          <span>LVL {level}</span>
        </div>

        {/* XP Total */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>{totalXp.toLocaleString()} XP</span>
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-quest-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white uppercase shadow">
            {user?.name ? user.name.charAt(0) : 'Q'}
          </div>
          <span className="hidden lg:inline text-xs font-medium text-slate-300 max-w-[120px] truncate">
            {user?.name || 'Adventurer'}
          </span>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

