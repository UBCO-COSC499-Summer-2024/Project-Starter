/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#001F3F',
        background: '#000000',
        cardBackground: '#FFFFFF',
        textPrimary: '#FFFFFF',
        textSecondary: '#333333',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
