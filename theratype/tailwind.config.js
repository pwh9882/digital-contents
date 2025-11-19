/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Semantic Colors mapped to CSS variables
        bg: {
          base: 'var(--bg-base)',
          surface: 'var(--bg-surface)',
          highlight: 'var(--bg-highlight)',
        },
        text: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
          inverted: 'var(--text-inverted)',
        },
        border: {
          base: 'var(--border-base)',
          highlight: 'var(--border-highlight)',
        },
        // Brand Colors
        primary: {
          DEFAULT: 'var(--primary-main)',
          hover: 'var(--primary-hover)',
          light: 'var(--primary-light)',
          contrast: 'var(--primary-contrast)',
          // Keep literal values for specific shades if needed, but prefer semantic
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#B8DAFF',
          300: '#85C0FF',
          400: '#4D9FFF',
          500: '#1A7FFF',
          600: '#0062D6',
          700: '#004EB3',
          800: '#004294',
          900: '#00387A',
        },
        secondary: {
          DEFAULT: 'var(--secondary-main)',
          hover: 'var(--secondary-hover)',
          light: 'var(--secondary-light)',
          contrast: 'var(--secondary-contrast)',
          50: '#F2FBF9',
          100: '#DFF7F2',
          200: '#BFECE4',
          300: '#94DCD0',
          400: '#64C6B7',
          500: '#3FA899',
          600: '#2D8A7E',
          700: '#266F66',
          800: '#225953',
          900: '#204A46',
        },
        // Status
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        info: 'var(--info)',
      },
      fontFamily: {
        sans: ['Inter', 'Pretendard', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(26, 127, 255, 0.3)',
        'dark-soft': '0 4px 20px -2px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
