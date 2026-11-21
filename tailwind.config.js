/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Appollo coffee palette
        espresso: "#4a2c1a",
        cream: "#e8d8c0",
        ember: "#9b5f3a",
        caramel: "#b08560",
        emberglow: "#d15c30",
        // Higgsfield palette (preserved)
        ink: "#07070a",
        bone: "#ecebf5",
      },
      fontFamily: {
        // Appollo
        display: ["var(--font-marker)", "cursive"],
        body: ["var(--font-lato)", "system-ui", "sans-serif"],
        label: ["var(--font-source)", "ui-monospace", "monospace"],
        // Higgsfield (preserved)
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
