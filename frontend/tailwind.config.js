/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: "#1db954",
          "green-hover": "#1ed760",
          black: "#121212",
          "black-light": "#181818",
          "black-lighter": "#282828",
          gray: "#b3b3b3",
          "gray-dark": "#4f4f4f",
        },
      },
      animation: {
        "spin-slow": "spin 1s linear infinite",
      },
    },
  },
  plugins: [],
};
