/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#fffbeb', // Light, sunny background tones
          100: '#fef3c7', // Gentle highlight
          200: '#fde68a', // Subtle, warm accent
          300: '#fcd34d', // Bright for buttons or active states
          400: '#fbbf24', // Warm and attention-grabbing
          500: '#f59e0b', // Strong focus color
          600: '#d97706', // Deep accent
          700: '#b45309', // Strong and earthy
          800: '#92400e', // Dark and grounded
          900: '#78350f', // Rich and contrasting
        },
      },
    },
  },
  plugins: [],
};
