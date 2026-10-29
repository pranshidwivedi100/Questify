import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Swords, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
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
          <h2 className="text-2xl font-black tracking-tight text-white">Welcome Back, Scholar</h2>
          <p className="text-xs text-slate-400 mt-1">Enter your credentials to resume your journey</p>
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
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adventurer@questify.io"
                className="w-full px-3.5 py-2.5 rounded-xl bg-quest-bg border border-quest-border text-white text-sm focus:outline-none focus:border-quest-purple focus:ring-1 focus:ring-quest-purple transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Password
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

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-quest-purple to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              <span>{loading ? 'Authenticating...' : 'Enter the Realm'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an adventurer account?{' '}
            <Link to="/register" className="text-quest-cyan font-semibold hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

