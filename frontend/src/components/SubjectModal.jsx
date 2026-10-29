import React, { useState } from 'react';
import { X, BookOpen, Palette, Clock } from 'lucide-react';

export const SubjectModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [colorHex, setColorHex] = useState('#8B5CF6');
  const [targetHours, setTargetHours] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const colorPresets = [
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#F43F5E', // Rose
    '#3B82F6', // Blue
    '#EC4899', // Pink
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Subject name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSave({
        name: name.trim(),
        colorHex,
        targetHours: Number(targetHours),
      });
      setName('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-quest-card border border-quest-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-quest-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-quest-cyan" />
            <h3 className="text-lg font-bold text-white">Create Subject</h3>
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
              Subject Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Advanced Algorithms"
              className="w-full px-3.5 py-2.5 rounded-xl bg-quest-bg border border-quest-border text-white text-sm focus:outline-none focus:border-quest-cyan focus:ring-1 focus:ring-quest-cyan transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-quest-purple" />
              Banner Color
            </label>
            <div className="flex items-center gap-3">
              {colorPresets.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColorHex(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    colorHex === c ? 'scale-125 ring-2 ring-white shadow-lg' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Target Study Hours
            </label>
            <input
              type="number"
              min="1"
              max="200"
              value={targetHours}
              onChange={(e) => setTargetHours(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-quest-bg border border-quest-border text-white text-sm focus:outline-none focus:border-quest-cyan transition-all"
            />
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
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-quest-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-glow-cyan disabled:opacity-50 transition-all"
            >
              {loading ? 'Creating...' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

