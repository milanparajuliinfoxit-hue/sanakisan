/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5fbf7',
          100: '#e8f7ed',
          200: '#ccefd8',
          300: '#9ed8b0',
          400: '#66bf84',
          500: '#3fa063',
          600: '#2f804d',
          700: '#24653d',
          800: '#1f4d33',
          900: '#1a3f2a',
          950: '#112b1d',
        },
        accent: '#d4a017',
        dark: '#0f2318',
        slate: {
          950: '#0f172a',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Source Serif 4', 'serif'],
        sans: ['Poppins', 'Inter', 'Segoe UI', 'sans-serif'],
        nepali: ['Mukta', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.08)',
        premium: '0 24px 80px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.8s ease-in-out infinite',
        'icon-pulse': 'iconPulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        iconPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.08)', opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
}
