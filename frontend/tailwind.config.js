/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#050505',
        'secondary-bg': '#0a0a0a',
        'accent-red': '#dc2626',
        'accent-purple': '#a855f7',
        'accent-blue': '#3b82f6',
        'accent-green': '#10b981',
        'accent-orange': '#f59e0b',
        'card-bg': '#111111',
        'border-color': 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
