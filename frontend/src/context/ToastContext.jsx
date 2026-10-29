import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ title, message, type = 'info', duration = 4000, xp = null }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, message, type, xp };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showXpToast = (xp, message = 'Quest Completed!') => {
    addToast({
      title: `+${xp} XP Gained!`,
      message,
      type: 'xp',
      xp,
      duration: 3500,
    });
  };

  const showLevelUpToast = (level) => {
    addToast({
      title: 'LEVEL UP!',
      message: `Congratulations! You reached Level ${level}!`,
      type: 'levelup',
      duration: 5000,
    });
  };

  const showAchievementToast = (achievement) => {
    addToast({
      title: `Achievement Unlocked: ${achievement.title}`,
      message: achievement.description,
      type: 'achievement',
      duration: 5000,
    });
  };

  const showErrorToast = (message) => {
    addToast({
      title: 'Error',
      message: message || 'Something went wrong',
      type: 'error',
      duration: 4000,
    });
  };

  const showSuccessToast = (title, message) => {
    addToast({
      title,
      message,
      type: 'success',
      duration: 3000,
    });
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        showXpToast,
        showLevelUpToast,
        showAchievementToast,
        showErrorToast,
        showSuccessToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

