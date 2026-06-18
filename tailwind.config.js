/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sapphire: { DEFAULT: '#0A0E27', light: '#141B3D', dark: '#060918' },
        platinum: { DEFAULT: '#64FFDA', light: '#9EFFE8', dark: '#00BFA5' },
        rosegold: { DEFAULT: '#E8B4B8', light: '#F5D5D8', dark: '#C48B8F' },
        velvet: { DEFAULT: '#7C3AED', light: '#A78BFA', dark: '#5B21B6' },
        pearl: '#F8FAFC',
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        heading: ['Playfair Display', 'serif'],
        display: ['Cinzel', 'serif'],
      },
      animation: {
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'glow-premium': 'glowPremium 3s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-rosegold': 'pulseRosegold 2s infinite',
      },
      keyframes: {
        floatSlow: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-15px)' } },
        glowPremium: { '0%': { boxShadow: '0 0 20px rgba(100,255,218,0.3)' }, '100%': { boxShadow: '0 0 40px rgba(100,255,218,0.5)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pulseRosegold: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(232,180,184,0.4)' }, '50%': { boxShadow: '0 0 30px 10px rgba(232,180,184,0)' } },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
