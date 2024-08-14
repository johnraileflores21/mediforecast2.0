/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT( {
  content: [
   "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/react/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
      customPink: '#C51849',
      customPurple: '#B524FF',
      customGreen: '#319641',
      customBlue: '#02A4F1',
      customDanger: '#DC3545',
      customImageIcon: '#41B35D',
      customButtonPost: '#0861F2',
      customMind: '#E4E6E9',
    },
    boxShadow: {
      '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      'custom-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      'custom-heavy-shadow': '5px 12px 16px 4px rgba(0, 0, 0, 0.3), 0 12px 40px 4px rgba(0, 0, 0, 0.25)',
      'scroll-to-top': '0 0 40px 5px rgba(0, 0, 0, 0.3), 0 0 40px 5px rgba(0, 0, 0, 0.25)',
    },
  },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["light"],
  }
});

