// tailwind.config.cjs
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#FFFB00',
        secondary: '#4E4E4E',
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        silkscreen: ["Silkscreen", "cursive"],
      },
    },
  },
  plugins: [],
};
