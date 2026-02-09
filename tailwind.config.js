/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0B0B',
        'electric-cyan': '#00F6FF',
        'neon-purple': '#A855F7',
        'signal-green': '#00FF85',
        'muted-gray': '#A1A1AA',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 15px rgba(0, 246, 255, 0.5)',
        'cyan-glow-strong': '0 0 25px rgba(0, 246, 255, 0.6)',
      }
    },
  },
  plugins: [],
}
