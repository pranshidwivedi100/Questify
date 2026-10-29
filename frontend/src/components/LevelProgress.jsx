import React from 'react';
import { Shield, Sparkles, ArrowRight } from 'lucide-react';

export const LevelProgress = ({ progress }) => {
  const currentLevel = progress?.currentLevel || 1;
  const totalXp = progress?.totalXp || 0;
  const currentLevelBaseXp = progress?.currentLevelBaseXp ?? (100 * (currentLevel - 1) * (currentLevel - 1));
  const nextLevelBaseXp = progress?.nextLevelBaseXp ?? (100 * currentLevel * currentLevel);
  const xpIntoLevel = progress?.xpIntoCurrentLevel ?? Math.max(0, totalXp - currentLevelBaseXp);
  const xpNeeded = progress?.xpNeededForNextLevel ?? Math.max(1, nextLevelBaseXp - currentLevelBaseXp);
  const percent = progress?.progressPercent ?? Math.min(100, Math.round(((xpIntoLevel / xpNeeded) * 100) * 10) / 10);

  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-quest-purple/10 rounded-full blur-3xl pointer-events-none group-hover:bg-quest-purple/15 transition-all"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-quest-purple to-indigo-700 flex items-center justify-center p-0.5 shadow-glow-purple">
            <div className="w-full h-full bg-quest-surface rounded-[14px] flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">LVL</span>
              <span className="text-xl font-black text-white leading-none">{currentLevel}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-wide">Level {currentLevel} Scholar</h3>
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400">
              Total Power: <span className="text-purple-300 font-semibold">{totalXp.toLocaleString()} XP</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-quest-elevated px-3 py-1.5 rounded-xl border border-quest-border">
          <span>{xpIntoLevel} / {xpNeeded} XP</span>
          <ArrowRight className="w-3.5 h-3.5 text-quest-purple" />
          <span className="text-quest-cyan font-bold">Lvl {currentLevel + 1}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 relative z-10">
        <div className="flex justify-between text-xs font-medium text-slate-400 mb-1.5">
          <span>Progress to next rank</span>
          <span className="text-quest-cyan font-bold">{percent}%</span>
        </div>
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-quest-purple via-indigo-500 to-quest-cyan transition-all duration-700 shadow-glow-purple"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

