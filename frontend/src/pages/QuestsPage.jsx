import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { questApi } from '../api/questApi';
import { subjectApi } from '../api/subjectApi';
import { QuestModal } from '../components/QuestModal';
import {
  CheckSquare,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  Calendar,
  Trash2,
  Edit2,
  RotateCcw,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const QuestsPage = () => {
  const { refreshProgress, updateProgressOptimistic } = useAuth();
  const { showXpToast, showLevelUpToast, showAchievementToast, showErrorToast, showSuccessToast } = useToast();

  const [quests, setQuests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    loadQuests();
  }, [statusFilter, priorityFilter, subjectFilter, searchQuery]);

  const loadSubjects = async () => {
    try {
      const data = await subjectApi.getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error('Failed to load subjects:', err);
    }
  };

  const loadQuests = async () => {
    try {
      setLoading(true);
      const data = await questApi.getQuests({
        status: statusFilter,
        priority: priorityFilter,
        subjectId: subjectFilter ? Number(subjectFilter) : undefined,
        search: searchQuery,
      });
      setQuests(data);
    } catch (err) {
      console.error('Failed to load quests:', err);
      showErrorToast('Failed to load quests');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuest = async (payload, id) => {
    if (id) {
      await questApi.updateQuest(id, payload);
      showSuccessToast('Quest Updated', 'Your quest objectives have been updated');
    } else {
      await questApi.createQuest(payload);
      showSuccessToast('Quest Forged', 'New quest added to your campaign');
    }
    loadQuests();
  };

  const handleCompleteQuest = async (quest) => {
    try {
      const response = await questApi.completeQuest(quest.id);

      if (!response.alreadyAwarded && response.xpAwarded > 0) {
        showXpToast(response.xpAwarded, `Completed: ${quest.title}`);
      } else {
        showSuccessToast('Quest Completed', 'Quest marked completed (XP previously claimed)');
      }

      if (response.levelUp) {
        showLevelUpToast(response.currentLevel);
      }
      if (response.newlyUnlockedAchievements && response.newlyUnlockedAchievements.length > 0) {
        response.newlyUnlockedAchievements.forEach((ach) => showAchievementToast(ach));
      }

      updateProgressOptimistic({
        totalXp: response.totalXp,
        currentLevel: response.currentLevel,
        currentStreak: response.currentStreak,
      });

      refreshProgress();
      loadQuests();
    } catch (err) {
      showErrorToast('Failed to complete quest');
    }
  };

  const handleReopenQuest = async (id) => {
    try {
      await questApi.reopenQuest(id);
      showSuccessToast('Quest Reopened', 'Quest moved back to active status');
      loadQuests();
    } catch (err) {
      showErrorToast('Failed to reopen quest');
    }
  };

  const handleDeleteQuest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quest?')) return;
    try {
      await questApi.deleteQuest(id);
      showSuccessToast('Quest Abandoned', 'Quest has been deleted');
      setQuests((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      showErrorToast('Failed to delete quest');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-quest-purple" />
            <span>Quest Log & Objectives</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Filter, manage, and complete your active missions to earn XP and level up.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingQuest(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-quest-purple to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Forge New Quest</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quests by title or description..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-quest-bg border border-quest-border text-white text-xs focus:outline-none focus:border-quest-purple transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-quest-bg border border-quest-border text-white text-xs focus:outline-none focus:border-quest-purple transition-all"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-quest-bg border border-quest-border text-white text-xs focus:outline-none focus:border-quest-purple transition-all"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High Priority</option>
          </select>

          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-quest-bg border border-quest-border text-white text-xs focus:outline-none focus:border-quest-purple transition-all"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quests List */}
      {loading ? (
        <div className="glass-panel p-12 text-center text-xs text-slate-400">
          Loading adventurer quests...
        </div>
      ) : quests.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
          <CheckSquare className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Quests Match Filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or status filter, or create a new quest.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {quests.map((quest) => {
            const isCompleted = quest.status === 'COMPLETED';
            return (
              <div
                key={quest.id}
                className={`glass-panel p-4 rounded-xl flex items-center justify-between gap-4 transition-all ${
                  isCompleted ? 'opacity-65 border-slate-800' : 'hover:border-quest-purple/50'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Status Toggle Button */}
                  {isCompleted ? (
                    <button
                      onClick={() => handleReopenQuest(quest.id)}
                      title="Reopen Quest"
                      className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center shrink-0 hover:bg-emerald-500/30 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCompleteQuest(quest)}
                      title="Complete Quest & Earn XP"
                      className="w-6 h-6 rounded-lg border-2 border-slate-600 hover:border-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center transition-all shrink-0 text-transparent hover:text-emerald-400"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`font-semibold text-sm truncate ${
                          isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                        }`}
                      >
                        {quest.title}
                      </h4>

                      {quest.subjectName && (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold border"
                          style={{
                            borderColor: `${quest.subjectColor}50`,
                            backgroundColor: `${quest.subjectColor}15`,
                            color: quest.subjectColor || '#8B5CF6',
                          }}
                        >
                          {quest.subjectName}
                        </span>
                      )}

                      {quest.priority === 'HIGH' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          HIGH
                        </span>
                      )}
                      {quest.priority === 'LOW' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                          LOW
                        </span>
                      )}
                    </div>

                    {quest.description && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xl">
                        {quest.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {quest.estimatedMinutes} mins
                      </span>
                      {quest.dueAt && (
                        <span
                          className={`flex items-center gap-1 ${
                            quest.overdue && !isCompleted ? 'text-rose-400 font-semibold' : ''
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          {new Date(quest.dueAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          {quest.overdue && !isCompleted && ' (Overdue)'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="shrink-0 flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-quest-purple/20 text-quest-purple-light border border-quest-purple/30">
                    +{quest.baseXp} XP
                  </span>

                  <button
                    onClick={() => {
                      setEditingQuest(quest);
                      setIsModalOpen(true);
                    }}
                    title="Edit Quest"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-quest-elevated transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteQuest(quest.id)}
                    title="Delete Quest"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <QuestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingQuest(null);
        }}
        onSave={handleSaveQuest}
        quest={editingQuest}
        subjects={subjects}
      />
    </div>
  );
};

