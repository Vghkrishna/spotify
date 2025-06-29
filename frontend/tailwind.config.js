/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: "#1db954",
          "green-hover": "#1ed760",
          "green-light": "#1ed760",
          "green-dark": "#1aa34a",
          black: "#121212",
          "black-light": "#181818",
          "black-lighter": "#282828",
          "black-dark": "#0a0a0a",
          gray: "#b3b3b3",
          "gray-dark": "#4f4f4f",
          "gray-light": "#e5e5e5",
          "gray-darker": "#2a2a2a",
          white: "#ffffff",
          "white-dim": "#e5e5e5",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.1)",
          dark: "rgba(0, 0, 0, 0.3)",
          blur: "rgba(255, 255, 255, 0.05)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-spotify":
          "linear-gradient(135deg, #1db954 0%, #1ed760 50%, #1aa34a 100%)",
        "gradient-dark":
          "linear-gradient(135deg, #121212 0%, #181818 50%, #282828 100%)",
        "gradient-glass":
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(40,40,40,0.8) 0%, rgba(24,24,24,0.9) 100%)",
      },
      animation: {
        "spin-slow": "spin 1s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 6s ease-in-out infinite",
        wave: "wave 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        glow: {
          "0%": {
            boxShadow: "0 0 5px #1db954, 0 0 10px #1db954, 0 0 15px #1db954",
          },
          "100%": {
            boxShadow: "0 0 10px #1db954, 0 0 20px #1db954, 0 0 30px #1db954",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wave: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(5deg)" },
          "75%": { transform: "rotate(-5deg)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        spotify: "0 8px 32px rgba(29, 185, 84, 0.3)",
        "spotify-hover": "0 12px 40px rgba(29, 185, 84, 0.4)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.1)",
        card: "0 4px 20px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 8px 30px rgba(0, 0, 0, 0.4)",
        "inner-glow": "inset 0 2px 4px rgba(255, 255, 255, 0.1)",
      },
      fontFamily: {
        spotify: ["Circular", "Helvetica", "Arial", "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
