/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'midnight-navy': '#0f172a',
        'charcoal': '#1e293b',
        'biolum-blue': '#60a5fa',
        'soft-lavender': '#a78bfa',
      },
    },
  },
  plugins: [],
}
