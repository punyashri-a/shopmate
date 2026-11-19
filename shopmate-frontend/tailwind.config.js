/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F4F7F5',
          100: '#E8F0EC',
          200: '#D1E2D8',
          300: '#AAC7B6',
          400: '#7BA78F',
          500: '#4A7C59',
          600: '#3D6B56',
          700: '#2E5443',
          800: '#244335',
          900: '#1B3228',
          950: '#0E1B15',
        },
        terracotta: {
          50: '#FDF8F6',
          100: '#F9EFEB',
          200: '#F3DFD6',
          300: '#E5BEAF',
          400: '#D59781',
          500: '#C86D51',
          600: '#B4583C',
          700: '#96452D',
          800: '#7B3826',
          900: '#642E20',
          950: '#3B170E',
        },
        ivory: {
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F5F2EB',
          300: '#EDE8DD',
          400: '#DFD8C9',
        },
        taupe: {
          50: '#FAF9F8',
          100: '#F2EFEB',
          200: '#E7E2DC',
          300: '#D5CEC5',
          400: '#B6ACA0',
          500: '#988C7E',
        },
        charcoal: {
          50: '#F6F7F6',
          100: '#E8EAE8',
          200: '#C8CCC9',
          300: '#9BA39D',
          400: '#6D756F',
          500: '#4B524D',
          600: '#343A36',
          700: '#252A26',
          800: '#1C201D',
          900: '#141715',
          950: '#0E100F',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Playfair Display', 'serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 2px 0 rgba(40, 30, 20, 0.05)',
        'warm': '0 4px 12px 0 rgba(40, 30, 20, 0.06)',
        'warm-md': '0 6px 20px -2px rgba(40, 30, 20, 0.08)',
        'warm-lg': '0 12px 32px -4px rgba(40, 30, 20, 0.1)',
        'warm-xl': '0 20px 48px -8px rgba(40, 30, 20, 0.12)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
