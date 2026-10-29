import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Swords, Lock, Mail, User, Globe, Target, ArrowRight, AlertCircle } from 'lucide-react';

export const RegisterPage = () => {
  const detectedZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [timezone, setTimezone] = useState(detectedZone);
  const [dailyGoalMins, setDailyGoalMins] = useState(60);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
        timezone,
        dailyGoalMins: Number(dailyGoalMins),
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-quest-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-quest-purple to-quest-cyan p-0.5 shadow-glow-purple items-center justify-center mb-3">
            <div className="w-full h-full bg-quest-bg rounded-[14px] flex items-center justify-center">
              <Swords className="w-6 h-6 text-quest-purple" />
            </div>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">Forge Your Character</h2>
          <p className="text-xs text-slate-400 mt-1">Begin your quest for academic mastery</p>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 rounded-2xl shadow-2xl">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Character / Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-quest-bg border border-quest-border text-white text-sm focus:outline-none focus:border-quest-purple focus:ring-1 focus:ring-quest-purple transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@university.edu"
                className="w-full px-3.5 py-2.5 rounded-xl bg-quest-bg border border-quest-border text-white text-sm focus:outline-none focus:border-quest-purple focus:ring-1 focus:ring-quest-purple transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Password (min. 6 characters)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-quest-bg border border-quest-border text-white text-sm focus:outline-none focus:border-quest-purple focus:ring-1 focus:ring-quest-purple transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  Timezone
                </label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-quest-bg border border-quest-border text-white text-xs focus:outline-none focus:border-quest-purple transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-slate-400" />
                  Daily Goal
                </label>
                <select
                  value={dailyGoalMins}
                  onChange={(e) => setDailyGoalMins(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-quest-bg border border-quest-border text-white text-xs focus:outline-none focus:border-quest-purple transition-all"
                >
                  <option value={30}>30 mins / day</option>
                  <option value={60}>60 mins / day</option>
                  <option value={90}>90 mins / day</option>
                  <option value={120}>2 hours / day</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-quest-purple to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              <span>{loading ? 'Creating Character...' : 'Embark on Quest'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-quest-cyan font-semibold hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

