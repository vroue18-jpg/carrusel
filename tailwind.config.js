/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        handwritten: ['Caveat', 'cursive'],
      },
      colors: {
        cream: {
          50: '#fffdf7',
          100: '#fef9ec',
          200: '#fdf3d0',
          300: '#fbe9a8',
        },
        brand: {
          orange: '#e8620a',
          'orange-light': '#f5813a',
          'orange-dark': '#c44f05',
          'orange-pale': '#fde8d8',
        },
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        popIn: { '0%': { opacity: '0', transform: 'scale(0.9)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        pulse2: { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.05)' } },
        timerPulse: { '0%,100%': { boxShadow: '0 0 0 0 rgba(232,98,10,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(232,98,10,0)' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out',
        popIn: 'popIn 0.3s ease-out',
        pulse2: 'pulse2 2s ease-in-out infinite',
        timerPulse: 'timerPulse 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
