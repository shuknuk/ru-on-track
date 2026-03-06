/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scarlet: '#CC0033',
        'rutgers-gray': '#5F6163',
      }
    },
  },
  plugins: [],
}