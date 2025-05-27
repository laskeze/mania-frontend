/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'mania-blue': '#1e40af',
        'mania-purple': '#7c3aed',
        'mania-green': '#059669',
      },
    },
  },
  plugins: [],
}
