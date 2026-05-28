/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#edfcf4',
          100: '#d3f8e3',
          200: '#aaf0cb',
          300: '#72e4ac',
          400: '#38ce87',
          500: '#14b46a',
          600: '#099356',
          700: '#087547',
          800: '#0a5d3a',
          900: '#094d31',
          950: '#032b1c',
        },
        surface: {
          50:  '#f8f9fb',
          100: '#f1f3f7',
          200: '#e4e8f0',
          300: '#cdd4e2',
          400: '#a9b5cc',
          500: '#8796b5',
          600: '#6a7a9b',
          700: '#566380',
          800: '#485369',
          900: '#3e4759',
          950: '#0f1420',
        },
        dark: {
          50:  '#1a1f2e',
          100: '#161b29',
          200: '#131724',
          300: '#10141f',
          400: '#0d1019',
          500: '#0a0d14',
          600: '#080b10',
          700: '#06080c',
          800: '#040608',
          900: '#020304',
        }
      },
      animation: {
        'fade-in':   'fadeIn 0.4s ease forwards',
        'slide-up':  'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-right':'slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in':  'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-soft':'pulseSoft 2s ease-in-out infinite',
        'shimmer':   'shimmer 1.5s infinite',
        'float':     'float 3s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%':      { transform: 'scale(1.35)' },
          '28%':      { transform: 'scale(1)' },
          '42%':      { transform: 'scale(1.2)' },
          '56%':      { transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'glow-green':    '0 0 20px rgba(20, 180, 106, 0.3)',
        'glow-green-lg': '0 0 40px rgba(20, 180, 106, 0.2)',
        'card':          '0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
        'card-hover':    '0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
        'dark-card':     '0 2px 12px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)',
      },
      backgroundImage: {
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(152,85%,35%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(152,85%,45%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(220,85%,35%,0.08) 0px, transparent 50%)',
      }
    },
  },
  plugins: [],
}