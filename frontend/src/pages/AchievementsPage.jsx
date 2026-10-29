import React, { useState, useEffect } from 'react';
import { gamificationApi } from '../api/gamificationApi';
import {
  Award,
  Flame,
  Zap,
  Timer,
  Lock,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const data = await gamificationApi.getAchievements();
      setAchievements(data);
    } catch (err) {
      console.error('Failed to load achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName, isUnlocked) => {
    const className = `w-7 h-7 ${isUnlocked ? 'text-amber-400' : 'text-slate-500'}`;
    switch (iconName) {
      case 'Award':
        return <Award className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Timer':
        return <Timer className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <span>Hall of Achievements</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Unlock legendary badges as you maintain study streaks, clear quests, and dominate deep focus.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold self-start sm:self-auto flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>{unlockedCount} / {achievements.length} Badges Claimed</span>
        </div>
      </div>

      {/* Grid of Badges */}
      {loading ? (
        <div className="glass-panel p-12 text-center text-xs text-slate-400">
          Unsealing the hall of badges...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`glass-panel p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
                ach.unlocked
                  ? 'border-amber-500/40 shadow-lg bg-gradient-to-b from-quest-surface via-quest-surface to-amber-950/20'
                  : 'opacity-55 border-slate-800'
              }`}
            >
              {ach.unlocked && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center p-0.5 border ${
                      ach.unlocked
                        ? 'border-amber-500/60 bg-amber-500/10 shadow-lg'
                        : 'border-slate-700 bg-slate-800/40'
                    }`}
                  >
                    {getIcon(ach.iconName, ach.unlocked)}
                  </div>

                  {ach.unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      Unlocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                      <Lock className="w-3 h-3" />
                      Locked
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-1">{ach.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{ach.description}</p>
              </div>

              <div className="pt-3 border-t border-quest-border/60 flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300">+{ach.xpReward} XP</span>
                {ach.unlocked && ach.unlockedAt && (
                  <span className="text-[10px] text-slate-400">
                    {new Date(ach.unlockedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

