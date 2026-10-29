import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Timer, Calendar, BarChart3, Award } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Quests', path: '/quests', icon: CheckSquare },
    { name: 'Focus Timer', path: '/timer', icon: Timer },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Achievements', path: '/achievements', icon: Award },
  ];

  return (
    <aside className="w-64 border-r border-quest-border bg-quest-surface/50 backdrop-blur-sm flex flex-col justify-between p-4 shrink-0 hidden md:flex">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-quest-purple/20 text-quest-purple-light border border-quest-purple/40 shadow-glow-purple font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-quest-elevated'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-quest-elevated/70 border border-quest-border text-center">
        <div className="text-xs font-semibold text-slate-300">Level Progression</div>
        <p className="text-[11px] text-slate-400 mt-1">
          Complete quests & focus sessions to gain XP and conquer your goals!
        </p>
      </div>
    </aside>
  );
};

