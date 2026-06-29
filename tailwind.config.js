/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        handwritten: ['Caveat', 'cursive'],
      },
      colors: {
        cinema: {
          black:  '#080808',
          dark:   '#0f0f0f',
          card:   '#141414',
          border: '#1e1e1e',
        },
        glow: {
          orange: '#e8620a',
          amber:  '#f59e0b',
          red:    '#c0392b',
          gold:   '#d4a017',
        },
      },
      backgroundImage: {
        'cinema-gradient': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(232,98,10,0.18) 0%, rgba(192,57,43,0.10) 35%, transparent 70%), linear-gradient(180deg, #0a0a0a 0%, #080808 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        'btn-gradient': 'linear-gradient(135deg, #e8620a 0%, #c0392b 100%)',
        'particle-active': 'linear-gradient(135deg, #e8620a 0%, #d4a017 100%)',
        'header-gradient': 'linear-gradient(135deg, rgba(232,98,10,0.15) 0%, rgba(192,57,43,0.10) 100%)',
      },
      boxShadow: {
        'glow-sm':  '0 0 12px rgba(232,98,10,0.25)',
        'glow-md':  '0 0 24px rgba(232,98,10,0.35), 0 0 48px rgba(192,57,43,0.15)',
        'glow-lg':  '0 0 40px rgba(232,98,10,0.45), 0 0 80px rgba(192,57,43,0.20)',
        'card':     '0 4px 24px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05) inset',
        'card-hover': '0 8px 40px rgba(0,0,0,0.8), 0 0 20px rgba(232,98,10,0.15), 0 1px 0 rgba(255,255,255,0.07) inset',
      },
      keyframes: {
        fadeIn:      { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        popIn:       { '0%': { opacity: '0', transform: 'scale(0.92)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        pulse2:      { '0%,100%': { transform: 'scale(1)', opacity: '0.7' }, '50%': { transform: 'scale(1.06)', opacity: '1' } },
        timerPulse:  { '0%,100%': { boxShadow: '0 0 0 0 rgba(232,98,10,0.5)' }, '50%': { boxShadow: '0 0 0 10px rgba(232,98,10,0)' } },
        shimmer:     { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
        orb:         { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '33%': { transform: 'translate(30px,-20px) scale(1.05)' }, '66%': { transform: 'translate(-20px,15px) scale(0.97)' } },
        diceRoll:    { '0%': { transform: 'rotate(0deg) scale(1)' }, '25%': { transform: 'rotate(180deg) scale(1.3)' }, '50%': { transform: 'rotate(360deg) scale(0.9)' }, '75%': { transform: 'rotate(540deg) scale(1.2)' }, '100%': { transform: 'rotate(720deg) scale(1)' } },
        slideInRight:{ '0%': { transform: 'translateX(120px) rotate(20deg)', opacity: '0' }, '60%': { transform: 'translateX(-8px) rotate(-3deg)', opacity: '1' }, '100%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' } },
        streakPop:   { '0%': { transform: 'scale(1)' }, '40%': { transform: 'scale(1.4)' }, '70%': { transform: 'scale(0.9)' }, '100%': { transform: 'scale(1)' } },
        colorFlash:  { '0%': { backgroundColor: 'transparent' }, '25%': { backgroundColor: 'rgba(212,160,23,0.85)', boxShadow: '0 0 28px rgba(212,160,23,0.9)' }, '100%': { backgroundColor: 'transparent', boxShadow: 'none' } },
      },
      animation: {
        fadeIn:      'fadeIn 0.45s cubic-bezier(0.16,1,0.3,1)',
        popIn:       'popIn 0.35s cubic-bezier(0.16,1,0.3,1)',
        pulse2:      'pulse2 3s ease-in-out infinite',
        timerPulse:  'timerPulse 1s ease-in-out infinite',
        shimmer:     'shimmer 3s linear infinite',
        orb:         'orb 8s ease-in-out infinite',
        diceRoll:    'diceRoll 0.6s cubic-bezier(0.16,1,0.3,1)',
        slideInRight:'slideInRight 0.5s cubic-bezier(0.16,1,0.3,1)',
        streakPop:   'streakPop 0.4s cubic-bezier(0.16,1,0.3,1)',
        colorFlash:  'colorFlash 0.35s ease-out',
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
}
