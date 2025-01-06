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
          350: '#d7b991',
          400: '#fbbf24', // Warm and attention-grabbing
          500: '#f59e0b', // Strong focus color
          600: '#d97706', // Deep accent
          700: '#b45309', // Strong and earthy
          800: '#92400e', // Dark and grounded
          900: '#78350f', // Rich and contrasting
        },

        activityCardColors: {
          950: '#bbdefb', // Light pastel blue for a subtle highlight
          960: '#ffb3a6', // Muted, calm blue for a relaxed feel
          970: '#c8e6c9', // Medium blue for active areas
          980: '#42a5f5', // Bright blue for engaging elements
          990: '#f8c6d6', // Strong, vibrant blue for attention
        },
        // activityCardColors: {
        //   950: '#fff4b3', // Very light golden yellow for a soft, subtle accent
        //   960: '#ffb3a6', // Very light coral for warmth, balancing with blue
        //   970: '#c8e6c9', // Very light minty green for a natural, soothing effect
        //   980: '#e1bee7', // Very light lavender for a gentle, elegant touch
        //   990: '#f8c6d6', // Very light pink for a soft and welcoming contrast
        // },
      },
      fontFamily: {
        rb: ['RB', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
