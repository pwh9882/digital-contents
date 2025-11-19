/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Deep Serenity Blue (Focus, Trust)
        primary: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#B8DAFF',
          300: '#85C0FF',
          400: '#4D9FFF',
          500: '#1A7FFF', // Main Brand Color
          600: '#0062D6',
          700: '#004EB3',
          800: '#004294',
          900: '#00387A',
          950: '#00234D',
        },
        // Secondary: Soft Sage / Teal (Healing, Growth)
        secondary: {
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
          950: '#0F2D2B',
        },
        // Neutral: Warm Gray (Comfort)
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
        // Semantic Colors
        success: '#10B981', // Emerald 500
        warning: '#F59E0B', // Amber 500
        error: '#EF4444',   // Red 500
        info: '#3B82F6',    // Blue 500
      },
      fontFamily: {
        sans: ['Inter', 'Pretendard', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Outfit', 'sans-serif'], // For headings if needed
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
      },
    },
  },
  plugins: [],
}
