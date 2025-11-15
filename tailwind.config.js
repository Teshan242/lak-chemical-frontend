/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        yellow: {
          300: '#fde68a',
          400: '#fbbf24',
        },
      },
    },
  },
  plugins: [],
}
