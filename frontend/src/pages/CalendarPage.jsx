import React, { useState, useEffect } from 'react';
import { questApi } from '../api/questApi';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

export const CalendarPage = () => {
  const { user, refreshProgress } = useAuth();
  const { showXpToast, showLevelUpToast, showAchievementToast, showErrorToast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [quests, setQuests] = useState([]);
  const [selectedDayQuests, setSelectedDayQuests] = useState(null);
  const [selectedDayDate, setSelectedDayDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMonthQuests();
  }, [currentDate]);

  const loadMonthQuests = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      // Start of month (inclusive of buffer days)
      const startDate = new Date(year, month, 1, 0, 0, 0);
      startDate.setDate(startDate.getDate() - 7);

      // End of month
      const endDate = new Date(year, month + 1, 0, 23, 59, 59);
      endDate.setDate(endDate.getDate() + 7);

      const data = await questApi.getCalendarQuests(
        startDate.toISOString(),
        endDate.toISOString()
      );
      setQuests(data);
    } catch (err) {
      console.error('Failed to load calendar quests:', err);
      showErrorToast('Failed to load calendar quests');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteQuest = async (id, title, baseXp) => {
    try {
      const response = await questApi.completeQuest(id);
      if (!response.alreadyAwarded && response.xpAwarded > 0) {
        showXpToast(response.xpAwarded, `Completed: ${title}`);
      }
      if (response.levelUp) {
        showLevelUpToast(response.currentLevel);
      }
      if (response.newlyUnlockedAchievements && response.newlyUnlockedAchievements.length > 0) {
        response.newlyUnlockedAchievements.forEach((ach) => showAchievementToast(ach));
      }
      refreshProgress();
      loadMonthQuests();

      // update selectedDayQuests
      setSelectedDayQuests((prev) =>
        prev ? prev.map((q) => (q.id === id ? { ...q, status: 'COMPLETED' } : q)) : null
      );
    } catch (err) {
      showErrorToast('Failed to complete quest');
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDayQuests(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDayQuests(null);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Group quests by date string YYYY-MM-DD
  const questsByDate = {};
  quests.forEach((q) => {
    if (q.dueAt) {
      const dateKey = q.dueAt.substring(0, 10);
      if (!questsByDate[dateKey]) {
        questsByDate[dateKey] = [];
      }
      questsByDate[dateKey].push(q);
    }
  });

  // Calculate Conflicts: days with >= 3 quests or estimated minutes > 180 (3 hours)
  const conflicts = [];
  Object.keys(questsByDate).forEach((dateKey) => {
    const dayQuests = questsByDate[dateKey];
    const totalEstMinutes = dayQuests.reduce((acc, cur) => acc + (cur.estimatedMinutes || 30), 0);
    const pendingCount = dayQuests.filter((q) => q.status !== 'COMPLETED').length;

    if (pendingCount >= 3 || totalEstMinutes > 180) {
      conflicts.push({
        date: dateKey,
        count: pendingCount,
        totalEstMinutes,
      });
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-emerald-400" />
            <span>Study Campaign Calendar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Map out deadlines, avoid study burnout, and resolve schedule conflicts.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2 bg-quest-surface border border-quest-border p-1 rounded-xl">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-quest-elevated transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-white px-3 min-w-[120px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-quest-elevated transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conflict Warning Alert Banner */}
      {conflicts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold">Schedule Overload Alert:</span> You have {conflicts.length} high-density study {conflicts.length === 1 ? 'day' : 'days'} scheduled this month ({conflicts.map((c) => c.date).join(', ')}). Consider distributing your estimated study hours earlier to prevent burnout.
          </div>
        </div>
      )}

      {/* Calendar Grid & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-panel p-5 rounded-3xl overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 sm:h-28 rounded-xl bg-quest-bg/40 border border-transparent"></div>
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayQuests = questsByDate[dateKey] || [];
              const isToday =
                new Date().toISOString().substring(0, 10) === dateKey;
              const isSelected = selectedDayDate === dateKey;

              const hasConflict = dayQuests.length >= 3;

              return (
                <div
                  key={day}
                  onClick={() => {
                    setSelectedDayQuests(dayQuests);
                    setSelectedDayDate(dateKey);
                  }}
                  className={`h-24 sm:h-28 p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-quest-purple bg-quest-purple/15 ring-2 ring-quest-purple shadow-glow-purple'
                      : isToday
                      ? 'border-quest-cyan/60 bg-quest-elevated/80'
                      : 'border-quest-border/80 bg-quest-surface/70 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-quest-cyan text-slate-900 flex items-center justify-center font-black'
                          : 'text-slate-300'
                      }`}
                    >
                      {day}
                    </span>

                    {hasConflict && (
                      <span title="Heavy workload day">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      </span>
                    )}
                  </div>

                  {/* Quest Badges */}
                  <div className="space-y-1 overflow-hidden mt-1">
                    {dayQuests.slice(0, 2).map((q) => (
                      <div
                        key={q.id}
                        className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium flex items-center gap-1 ${
                          q.status === 'COMPLETED'
                            ? 'bg-emerald-500/15 text-emerald-300 line-through'
                            : 'bg-quest-purple/20 text-purple-200 border border-quest-purple/30'
                        }`}
                      >
                        <span className="truncate">{q.title}</span>
                      </div>
                    ))}
                    {dayQuests.length > 2 && (
                      <div className="text-[9px] text-slate-400 font-bold px-1">
                        +{dayQuests.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Quests Side Panel */}
        <div className="glass-panel p-5 rounded-3xl space-y-4">
          <div className="border-b border-quest-border pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-quest-purple" />
              <span>Day Details</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedDayDate ? new Date(selectedDayDate).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }) : 'Select a day to view agenda'}
            </p>
          </div>

          {!selectedDayQuests ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Click any calendar day to inspect scheduled quests, deadlines, and finish tasks.
            </div>
          ) : selectedDayQuests.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No quests due on this date.
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayQuests.map((q) => {
                const isCompleted = q.status === 'COMPLETED';
                return (
                  <div
                    key={q.id}
                    className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                      isCompleted ? 'bg-quest-elevated/40 border-slate-800 opacity-60' : 'bg-quest-elevated border-quest-border'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-semibold ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                          {q.title}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                        <span>{q.estimatedMinutes} mins</span>
                        <span>•</span>
                        <span className="text-purple-300 font-bold">+{q.baseXp} XP</span>
                      </div>
                    </div>

                    {!isCompleted && (
                      <button
                        onClick={() => handleCompleteQuest(q.id, q.title, q.baseXp)}
                        className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[10px] font-bold border border-emerald-500/40 shrink-0"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

