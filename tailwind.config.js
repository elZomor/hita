/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primaryColor: '#8B0000',
        secondaryColor: '#E17055',
        accentColor: '#F9A825',
        neutralColorOne: '#F5F5F5',
        neutralColorTwo: '#FAF3E0',
        textColorMain: '#333333',
        textColorAlt: '#3E2723',
        darkRed: '#531812',
        gold: '#db9241',
      },
    },
  },
  plugins: [],
};
