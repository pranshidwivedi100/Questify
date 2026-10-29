import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Swords, Flame, Shield, Zap, Sparkles, CheckSquare, BarChart3, ArrowRight, Award } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-quest-bg text-slate-100 flex flex-col justify-between selection:bg-quest-purple selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-quest-border/80 bg-quest-surface/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-quest-purple to-quest-cyan p-0.5 shadow-glow-purple flex items-center justify-center">
            <div className="w-full h-full bg-quest-bg rounded-[10px] flex items-center justify-center">
              <Swords className="w-5 h-5 text-quest-purple" />
            </div>
          </div>
          <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
            QUESTIFY
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-quest-elevated transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-quest-purple to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple transition-all"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-quest-purple/15 border border-quest-purple/40 text-purple-300 text-xs font-bold mb-8 shadow-glow-purple">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>The Next Generation Gamified Productivity Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl leading-[1.15]">
          Level Up Your Mind. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
            Turn Every Study Task Into an Epic Quest.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Break out of study burnout. Questify transforms homework, exam prep, and daily study habits into an interactive RPG with real XP, level progressions, unbroken streaks, and focus sessions.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base bg-gradient-to-r from-quest-purple to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <span>Start Your Adventure Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-base bg-quest-surface hover:bg-quest-elevated text-slate-300 hover:text-white border border-quest-border transition-all"
          >
            Log In to Existing Account
          </button>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="glass-panel p-6 rounded-2xl hover:border-quest-purple/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-quest-purple/30 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-quest-purple" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">RPG Level & XP Engine</h3>
            <p className="text-sm text-slate-400">
              Mathematically balanced leveling curve <span className="text-slate-300 font-mono text-xs">floor(0.1 * sqrt(XP)) + 1</span>. Earn XP for every completed quest and focus minute.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
              <Flame className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Timezone-Aware Streaks</h3>
            <p className="text-sm text-slate-400">
              Never lose your hard-earned streak when travelling or studying late at night. Timezone-normalized activity keeps your flame burning.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl hover:border-cyan-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-quest-cyan" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Idempotent XP Ledger</h3>
            <p className="text-sm text-slate-400">
              Enterprise-grade transaction ledger ensures zero duplicate exploits. Complete, reopen, and reorganize quests with 100% data integrity.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-quest-border/60 py-6 text-center text-xs text-slate-500">
        Questify &copy; {new Date().getFullYear()} — Gamified Study Management Platform. Built for peak academic performance.
      </footer>
    </div>
  );
};

