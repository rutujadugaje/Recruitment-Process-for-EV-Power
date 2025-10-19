/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A192F',
        gold: '#FFD700',
        teal: '#2c3b38',
        burntOrange: '#ed4c39',
        red: '#ff5733',
        lavender: '#fcaafc',
        mintGreen: '#abda92',
        softBlue: '#a0c4ff',
        deepPurple: '#5B2A86',
        electricOrange: '#FF6700',
        magenta: '#E63946',
      },
    },
  },
  plugins: [],
}