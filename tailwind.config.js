/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "var(--color-navy)",
          dark: "var(--color-navy-dark)",
          light: "var(--color-navy-light)",
        },
        gold: {
          DEFAULT: "var(--color-gold)",
          light: "var(--color-gold-light)",
        },
        brand: {
          red: "var(--color-red)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        cardHover: "var(--shadow-hover)",
      },
      borderRadius: {
        DEFAULT: "var(--radius-md)",
      },
    },
  },
  plugins: [],
};
