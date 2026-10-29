import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { questApi } from '../api/questApi';
import { subjectApi } from '../api/subjectApi';
import { analyticsApi } from '../api/analyticsApi';
import { LevelProgress } from '../components/LevelProgress';
import { QuestModal } from '../components/QuestModal';
import { SubjectModal } from '../components/SubjectModal';
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Flame,
  Zap,
  Target,
  ArrowRight,
  BookOpen,
  Calendar,
  AlertTriangle,
  Play
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { user, progress, refreshProgress, updateProgressOptimistic } = useAuth();
  const { showXpToast, showLevelUpToast, showAchievementToast, showErrorToast } = useToast();
  const navigate = useNavigate();

  const [quests, setQuests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [questsData, subjectsData, analyticsData] = await Promise.all([
        questApi.getQuests({ status: 'PENDING' }),
        subjectApi.getSubjects(),
        analyticsApi.getDashboardAnalytics(),
      ]);
      setQuests(questsData);
      setSubjects(subjectsData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      showErrorToast('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteQuest = async (id, title, baseXp) => {
    try {
      const response = await questApi.completeQuest(id);

      // Trigger toasts
      if (!response.alreadyAwarded && response.xpAwarded > 0) {
        showXpToast(response.xpAwarded, `Completed: ${title}`);
      }
      if (response.levelUp) {
        showLevelUpToast(response.currentLevel);
      }
      if (response.newlyUnlockedAchievements && response.newlyUnlockedAchievements.length > 0) {
        response.newlyUnlockedAchievements.forEach((ach) => showAchievementToast(ach));
      }

      // Optimistically update progress
      updateProgressOptimistic({
        totalXp: response.totalXp,
        currentLevel: response.currentLevel,
        currentStreak: response.currentStreak,
      });

      // Remove from pending list
      setQuests((prev) => prev.filter((q) => q.id !== id));
      refreshProgress();
    } catch (err) {
      console.error('Error completing quest:', err);
      showErrorToast('Could not complete quest');
    }
  };

  const handleSaveQuest = async (payload) => {
    await questApi.createQuest(payload);
    loadDashboardData();
  };

  const handleSaveSubject = async (payload) => {
    await subjectApi.createSubject(payload);
    loadDashboardData();
  };

  const streak = progress?.currentStreak ?? user?.progress?.currentStreak ?? 0;
  const longestStreak = progress?.longestStreak ?? user?.progress?.longestStreak ?? 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Adventurer Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Welcome back, <span className="text-purple-300 font-semibold">{user?.name}</span>. Ready to conquer your daily study objectives?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSubjectModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-quest-elevated hover:bg-quest-border border border-quest-border text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-quest-cyan" />
            <span>New Subject</span>
          </button>

          <button
            onClick={() => setIsQuestModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-quest-purple to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Forge Quest</span>
          </button>
        </div>
      </div>

      {/* Level & XP Progression Hero Card */}
      <LevelProgress progress={progress} />

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Card */}
        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Study Streak</span>
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{streak}</span>
            <span className="text-xs text-amber-300 font-medium">Days Active</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Personal Best: <span className="text-slate-200 font-semibold">{longestStreak} Days</span>
          </div>
        </div>

        {/* Pending Quests */}
        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-quest-purple">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Quests</span>
            <Target className="w-5 h-5 text-quest-purple" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{analytics?.pendingQuests ?? quests.length}</span>
            <span className="text-xs text-purple-300 font-medium">In Queue</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Completion Rate: <span className="text-slate-200 font-semibold">{analytics?.completionRate ?? 0}%</span>
          </div>
        </div>

        {/* Focus Study Time */}
        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-quest-cyan">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Focus Time</span>
            <Clock className="w-5 h-5 text-quest-cyan" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {Math.floor((analytics?.totalFocusMinutes || 0) / 60)}h {(analytics?.totalFocusMinutes || 0) % 60}m
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Daily Goal: {user?.dailyGoalMins || 60}m</span>
            <button
              onClick={() => navigate('/timer')}
              className="text-quest-cyan hover:underline flex items-center gap-1 font-semibold"
            >
              Start Timer <Play className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {/* On-Time Rate */}
        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">On-Time Rate</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{analytics?.onTimeCompletionRate ?? 100}%</span>
            <span className="text-xs text-emerald-300 font-medium">On Track</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Strict Deadlines Met
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Quests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-quest-purple" />
              <span>Today's Pending Quests</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-quest-purple/20 text-purple-300">
                {quests.length}
              </span>
            </h2>

            <button
              onClick={() => navigate('/quests')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              View All Quests <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {quests.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-quest-purple/10 border border-quest-purple/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-quest-purple" />
              </div>
              <h3 className="text-sm font-bold text-white">All Quests Completed!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You've cleared all pending tasks. Forge a new quest to continue earning XP and leveling up.
              </p>
              <button
                onClick={() => setIsQuestModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-quest-purple text-white shadow-glow-purple hover:bg-purple-600 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Forge New Quest
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {quests.slice(0, 5).map((q) => (
                <div
                  key={q.id}
                  className="glass-panel p-4 rounded-xl flex items-center justify-between gap-4 hover:border-quest-purple/50 transition-all group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      onClick={() => handleCompleteQuest(q.id, q.title, q.baseXp)}
                      title="Mark Complete & Claim XP"
                      className="w-6 h-6 rounded-lg border-2 border-slate-600 hover:border-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center transition-all shrink-0 text-transparent hover:text-emerald-400"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-slate-100 group-hover:text-purple-300 transition-colors truncate">
                          {q.title}
                        </span>
                        {q.subjectName && (
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold border"
                            style={{
                              borderColor: `${q.subjectColor}50`,
                              backgroundColor: `${q.subjectColor}15`,
                              color: q.subjectColor || '#8B5CF6',
                            }}
                          >
                            {q.subjectName}
                          </span>
                        )}
                        {q.priority === 'HIGH' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            HIGH
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {q.estimatedMinutes} mins
                        </span>
                        {q.dueAt && (
                          <span className={`flex items-center gap-1 ${q.overdue ? 'text-rose-400 font-semibold' : ''}`}>
                            <Calendar className="w-3 h-3" />
                            {new Date(q.dueAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            {q.overdue && ' (Overdue)'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-quest-purple/20 text-quest-purple-light border border-quest-purple/30">
                      +{q.baseXp} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Weekly Progress Chart */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                7-Day Study & XP Momentum
              </h3>
              <span className="text-[11px] text-slate-400">Past 7 Days</span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics?.dailyTrends || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="dayOfWeek" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#151C30',
                      borderColor: '#242F4D',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="xpEarned" name="XP Earned" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorXp)" />
                  <Area type="monotone" dataKey="focusMinutes" name="Focus Mins" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorMinutes)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Subjects & Focus Quick Action */}
        <div className="space-y-6">
          {/* Quick Focus Launch Card */}
          <div className="glass-panel p-5 rounded-2xl bg-gradient-to-br from-quest-surface via-quest-surface to-indigo-950/40 border border-quest-purple/30">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-quest-purple" />
              Focus Pomodoro
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Deep work sessions grant 2 XP per minute. Lock in and defeat distractions.
            </p>
            <button
              onClick={() => navigate('/timer')}
              className="mt-4 w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-quest-purple to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Focus Session</span>
            </button>
          </div>

          {/* Subjects Progress List */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-quest-cyan" />
                <span>Subject Mastery</span>
              </h3>
              <button
                onClick={() => setIsSubjectModalOpen(true)}
                className="text-[11px] text-quest-cyan hover:underline font-semibold"
              >
                + Add
              </button>
            </div>

            {subjects.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                No subjects yet. Add your courses or topics to track hours!
              </p>
            ) : (
              <div className="space-y-3.5">
                {subjects.map((sub) => {
                  const hoursStudied = Math.round((sub.totalMinutesStudied / 60) * 10) / 10;
                  const percent = Math.min(100, Math.round((hoursStudied / sub.targetHours) * 100));
                  return (
                    <div key={sub.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.colorHex }}></span>
                          {sub.name}
                        </span>
                        <span className="text-slate-400 font-medium">
                          {hoursStudied} / {sub.targetHours}h
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: sub.colorHex || '#8B5CF6',
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuestModal
        isOpen={isQuestModalOpen}
        onClose={() => setIsQuestModalOpen(false)}
        onSave={handleSaveQuest}
        subjects={subjects}
      />

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSave={handleSaveSubject}
      />
    </div>
  );
};

