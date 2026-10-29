import React from 'react';
import { useToast } from '../context/ToastContext';
import { Award, Zap, CheckCircle2, AlertTriangle, X, Sparkles } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
            toast.type === 'xp'
              ? 'bg-quest-surface/95 border-quest-purple shadow-glow-purple text-white'
              : toast.type === 'levelup'
              ? 'bg-gradient-to-r from-purple-900/90 to-indigo-900/90 border-yellow-400/80 shadow-lg text-white'
              : toast.type === 'achievement'
              ? 'bg-quest-surface/95 border-amber-500/80 shadow-lg text-white'
              : toast.type === 'success'
              ? 'bg-quest-surface/95 border-emerald-500/80 text-white'
              : 'bg-quest-surface/95 border-rose-500/80 text-white'
          }`}
        >
          <div className="p-2 rounded-lg bg-white/10 shrink-0">
            {toast.type === 'xp' && <Zap className="w-5 h-5 text-quest-purple animate-pulse" />}
            {toast.type === 'levelup' && <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />}
            {toast.type === 'achievement' && <Award className="w-5 h-5 text-amber-400" />}
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400" />}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold tracking-wide flex items-center gap-2">
              {toast.title}
              {toast.xp && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-quest-purple/30 text-quest-purple-light border border-quest-purple/40">
                  +{toast.xp} XP
                </span>
              )}
            </h4>
            {toast.message && <p className="text-xs text-slate-300 mt-0.5">{toast.message}</p>}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

