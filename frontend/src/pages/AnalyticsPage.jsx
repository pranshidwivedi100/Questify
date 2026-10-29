import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../api/analyticsApi';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Zap,
  Target,
  CheckCircle2,
  Calendar,
  BookOpen
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsApi.getDashboardAnalytics();
      setData(res);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-12 text-center text-xs text-slate-400">
        Synthesizing academic telemetry...
      </div>
    );
  }

  const subjectChartData = (data?.subjectBreakdown || []).map((s) => ({
    name: s.subjectName,
    studiedHours: s.completedHours,
    targetHours: s.targetHours,
    completedQuests: s.completedQuestCount,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-quest-purple" />
          <span>Academic Telemetry & Analytics</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Quantitative insights into study velocity, subject investment, and completion accuracy.
        </p>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Overall Completion</span>
            <Target className="w-4 h-4 text-quest-purple" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">{data?.completionRate || 0}%</div>
          <div className="mt-1 text-[11px] text-slate-400">
            {data?.completedQuests} of {data?.totalQuests} quests completed
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>On-Time Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">{data?.onTimeCompletionRate || 100}%</div>
          <div className="mt-1 text-[11px] text-slate-400">
            Deadlines satisfied without delays
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Total Focused Study</span>
            <Clock className="w-4 h-4 text-quest-cyan" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {Math.floor((data?.totalFocusMinutes || 0) / 60)}h {(data?.totalFocusMinutes || 0) % 60}m
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Accumulated in focus sessions
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Total XP Earned</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">{(data?.totalXpEarned || 0).toLocaleString()}</div>
          <div className="mt-1 text-[11px] text-slate-400">
            Current streak: {data?.currentStreak} days
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Velocity Chart */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-quest-purple" />
              <span>Daily Study Velocity & XP Surge</span>
            </h3>
            <span className="text-xs text-slate-400">Last 7 Days</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.dailyTrends || []}>
                <defs>
                  <linearGradient id="anXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="anMins" x1="0" y1="0" x2="0" y2="1">
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
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
                <Area type="monotone" dataKey="xpEarned" name="XP Earned" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#anXp)" />
                <Area type="monotone" dataKey="focusMinutes" name="Focus Minutes" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#anMins)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Breakdown Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-quest-cyan" />
              <span>Subject Investment (Target vs Logged Hours)</span>
            </h3>
            <span className="text-xs text-slate-400">By Subject</span>
          </div>

          <div className="h-64 w-full">
            {subjectChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No subjects registered. Create subjects in Dashboard or Quests to view distribution!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectChartData}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
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
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
                  <Bar dataKey="studiedHours" name="Hours Studied" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="targetHours" name="Target Hours" fill="#242F4D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

