/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quest: {
          bg: '#0B0E17',
          surface: '#121829',
          elevated: '#182037',
          card: '#151C30',
          border: '#242F4D',
          hover: '#1F2942',
          purple: '#8B5CF6',
          'purple-dark': '#6D28D9',
          'purple-light': '#A78BFA',
          cyan: '#06B6D4',
          'cyan-dark': '#0891B2',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        gaming: ['Orbitron', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'glow-purple': '0 0 20px -3px rgba(139, 92, 246, 0.45)',
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.45)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.45)'
      }
    },
  },
  plugins: [],
};

