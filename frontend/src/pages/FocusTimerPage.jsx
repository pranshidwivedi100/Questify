import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { timerApi } from '../api/timerApi';
import { subjectApi } from '../api/subjectApi';
import { questApi } from '../api/questApi';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  CheckSquare,
  Sparkles,
  Zap,
  Clock,
  History,
  Trash2
} from 'lucide-react';

export const FocusTimerPage = () => {
  const { refreshProgress } = useAuth();
  const { showXpToast, showAchievementToast, showSuccessToast, showErrorToast } = useToast();

  const presets = [
    { label: 'Pomodoro', minutes: 25 },
    { label: 'Deep Dive', minutes: 50 },
    { label: 'Sprint', minutes: 15 },
    { label: 'Short Break', minutes: 5 },
  ];

  const [selectedDuration, setSelectedDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);

  // Linkings
  const [subjects, setSubjects] = useState([]);
  const [quests, setQuests] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedQuestId, setSelectedQuestId] = useState('');

  // Past Sessions
  const [sessions, setSessions] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    loadOptions();
    loadSessions();
  }, []);

  const loadOptions = async () => {
    try {
      const [subjectsData, questsData] = await Promise.all([
        subjectApi.getSubjects(),
        questApi.getQuests({ status: 'PENDING' }),
      ]);
      setSubjects(subjectsData);
      setQuests(questsData);
    } catch (err) {
      console.error('Failed to load timer options:', err);
    }
  };

  const loadSessions = async () => {
    try {
      const data = await timerApi.getSessions();
      setSessions(data);
    } catch (err) {
      console.error('Failed to load past sessions:', err);
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleStart = () => {
    if (!isRunning && !sessionStartTime) {
      setSessionStartTime(new Date().toISOString());
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
    setSessionStartTime(null);
  };

  const selectPreset = (minutes) => {
    setIsRunning(false);
    setSelectedDuration(minutes);
    setTimeLeft(minutes * 60);
    setSessionStartTime(null);
  };

  const handleSessionComplete = async () => {
    const xpEarned = selectedDuration * 2;
    try {
      await timerApi.logSession({
        subjectId: selectedSubjectId ? Number(selectedSubjectId) : null,
        questId: selectedQuestId ? Number(selectedQuestId) : null,
        durationMinutes: selectedDuration,
        startedAt: sessionStartTime || new Date(Date.now() - selectedDuration * 60000).toISOString(),
        completedAt: new Date().toISOString(),
      });

      showXpToast(xpEarned, `Completed ${selectedDuration}-minute focus block!`);
      if (selectedDuration >= 25) {
        showAchievementToast({
          title: 'Focus Master',
          description: 'Logged a deep focus session of 25+ minutes',
        });
      }

      refreshProgress();
      loadSessions();
      handleReset();
    } catch (err) {
      console.error('Failed to log focus session:', err);
      showErrorToast('Failed to save focus session');
    }
  };

  const handleDeleteSession = async (id) => {
    try {
      await timerApi.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      showSuccessToast('Session Removed', 'Session record deleted');
    } catch (err) {
      showErrorToast('Failed to delete session');
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Timer className="w-6 h-6 text-quest-cyan" />
          <span>Pomodoro Focus Chamber</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Lock in uninterrupted focus. Every minute yields 2 XP towards your adventurer level.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Timer Display */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-quest-cyan/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 relative z-10">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => selectPreset(p.minutes)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedDuration === p.minutes
                    ? 'bg-quest-cyan text-slate-900 font-bold shadow-glow-cyan'
                    : 'bg-quest-elevated text-slate-300 hover:bg-quest-border border border-quest-border'
                }`}
              >
                {p.label} ({p.minutes}m)
              </button>
            ))}
          </div>

          {/* Circular / Large Timer Display */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-quest-border flex flex-col items-center justify-center shadow-2xl relative z-10 bg-quest-surface/90">
            <div
              className="absolute inset-0 rounded-full border-4 border-quest-cyan transition-all duration-1000 shadow-glow-cyan pointer-events-none"
              style={{
                clipPath: `polygon(50% 50%, -50% -50%, ${progressPercent * 2}% -50%, ${progressPercent * 2}% 150%, -50% 150%)`,
              }}
            ></div>

            <span className="font-mono text-5xl sm:text-6xl font-black text-white tracking-wider">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>

            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Yield: +{selectedDuration * 2} XP</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-8 relative z-10">
            <button
              onClick={handleReset}
              className="p-3.5 rounded-2xl bg-quest-elevated border border-quest-border text-slate-300 hover:text-white hover:bg-quest-border transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {isRunning ? (
              <button
                onClick={handlePause}
                className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg transition-all"
              >
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause Focus</span>
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-quest-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm flex items-center gap-2 shadow-glow-cyan transition-all"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Focus</span>
              </button>
            )}
          </div>
        </div>

        {/* Right 1 Col: Session Linkings & History */}
        <div className="space-y-6">
          {/* Link to Subject / Quest */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-quest-purple" />
              <span>Link Focus Objective</span>
            </h3>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Target Subject
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-quest-bg border border-quest-border text-white text-xs focus:outline-none focus:border-quest-purple transition-all"
              >
                <option value="">General Study (No Subject)</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Target Quest (Optional)
              </label>
              <select
                value={selectedQuestId}
                onChange={(e) => setSelectedQuestId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-quest-bg border border-quest-border text-white text-xs focus:outline-none focus:border-quest-purple transition-all"
              >
                <option value="">None / Open Exploration</option>
                {quests.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Past Focus Sessions */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              <span>Recent Focus Sessions</span>
            </h3>

            {sessions.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                No focus sessions logged yet. Complete a session to log study hours!
              </p>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {sessions.slice(0, 6).map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 rounded-xl bg-quest-elevated border border-quest-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">
                        {s.durationMinutes} mins
                        {s.subjectName && (
                          <span
                            className="ml-2 px-1.5 py-0.5 rounded text-[10px]"
                            style={{ backgroundColor: `${s.subjectColor}20`, color: s.subjectColor || '#8B5CF6' }}
                          >
                            {s.subjectName}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(s.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • +{s.xpEarned} XP
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteSession(s.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

