import React, { useState, useEffect } from 'react';
import { X, Sparkles, BookOpen, Clock, Calendar, Flag } from 'lucide-react';

export const QuestModal = ({ isOpen, onClose, onSave, quest = null, subjects = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    priority: 'MEDIUM',
    baseXp: 50,
    estimatedMinutes: 30,
    dueAt: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (quest) {
      setFormData({
        title: quest.title || '',
        description: quest.description || '',
        subjectId: quest.subjectId ? String(quest.subjectId) : '',
        priority: quest.priority || 'MEDIUM',
        baseXp: quest.baseXp || 50,
        estimatedMinutes: quest.estimatedMinutes || 30,
        dueAt: quest.dueAt ? quest.dueAt.substring(0, 16) : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        subjectId: subjects.length > 0 ? String(subjects[0].id) : '',
        priority: 'MEDIUM',
        baseXp: 50,
        estimatedMinutes: 30,
        dueAt: '',
      });
    }
    setError('');
  }, [quest, subjects, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description,
        subjectId: formData.subjectId ? Number(formData.subjectId) : null,
        priority: formData.priority,
        baseXp: Number(formData.baseXp),
        estimatedMinutes: Number(formData.estimatedMinutes),
        dueAt: formData.dueAt ? new Date(formData.dueAt).toISOString() : null,
      };

      await onSave(payload, quest?.id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save quest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-quest-card border border-quest-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-quest-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-quest-purple" />
            <h3 className="text-lg font-bold text-white">
              {quest ? 'Edit Quest' : 'Forge New Quest'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-quest-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Quest Objective *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Master Calculus Integration Techniques"
              className="w-full px-3.5 py-2.5 rounded-xl bg-quest-bg border border-quest-border text-white text-sm focus:outline-none focus:border-quest-purple focus:ring-1 focus:ring-quest-purple transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-quest-cyan" />
                Subject
              </label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-quest-bg border border-quest-border text-white text-sm focus:outline-none focus:border-quest-purple transition-all"
              >
                <option value="">None / General</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-quest-purple" />
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-quest-bg border border-quest-border text-white text-sm focus:outline-none focus:border-quest-purple transition-all"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High (Boss Raid)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                XP Reward
              </label>
              <input
                type="number"
                min="10"
                max="500"
                step="5"
                value={formData.baseXp}
                onChange={(e) => setFormData({ ...formData, baseXp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-quest-bg border border-quest-border text-white text-sm focus:outline-none focus:border-quest-purple transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Est. Minutes
              </label>
              <input
                type="number"
                min="5"
                max="360"
                step="5"
                value={formData.estimatedMinutes}
                onChange={(e) => setFormData({ ...formData, estimatedMinutes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-quest-bg border border-quest-border text-white text-sm focus:outline-none focus:border-quest-purple transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Deadline (Due Date)
            </label>
            <input
              type="datetime-local"
              value={formData.dueAt}
              onChange={(e) => setFormData({ ...formData, dueAt: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-quest-bg border border-quest-border text-white text-sm focus:outline-none focus:border-quest-purple transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Description & Notes
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Key objectives, chapters to review, formulas to memorize..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-quest-bg border border-quest-border text-white text-sm focus:outline-none focus:border-quest-purple transition-all resize-none"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-quest-elevated transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-quest-purple to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? 'Saving...' : quest ? 'Update Quest' : 'Forge Quest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

