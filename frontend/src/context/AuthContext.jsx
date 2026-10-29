import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { gamificationApi } from '../api/gamificationApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('questify_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('questify_token'));
  const [progress, setProgress] = useState(user?.progress || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const profile = await authApi.getCurrentUser();
          setUser(profile);
          setProgress(profile.progress);
          localStorage.setItem('questify_user', JSON.stringify(profile));
        } catch (err) {
          console.error('Session validation failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    localStorage.setItem('questify_token', data.token);
    localStorage.setItem('questify_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setProgress(data.user.progress);
    return data;
  };

  const register = async (userData) => {
    const data = await authApi.register(userData);
    localStorage.setItem('questify_token', data.token);
    localStorage.setItem('questify_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setProgress(data.user.progress);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('questify_token');
    localStorage.removeItem('questify_user');
    setToken(null);
    setUser(null);
    setProgress(null);
  };

  const refreshProgress = async () => {
    if (!token) return;
    try {
      const updated = await gamificationApi.getProgress();
      setProgress(updated);
      if (user) {
        const updatedUser = { ...user, progress: updated };
        setUser(updatedUser);
        localStorage.setItem('questify_user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error('Failed to refresh progress:', err);
    }
  };

  const updateProgressOptimistic = (newProgressData) => {
    setProgress((prev) => ({ ...prev, ...newProgressData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        progress,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        refreshProgress,
        updateProgressOptimistic,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

