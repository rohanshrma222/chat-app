/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'slate-900': '#0f172a',
        'slate-800': '#1e293b',
        'purple-600': '#9333ea',
      }
    },
  },
  plugins: [],
}

