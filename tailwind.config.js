/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fontFamily: {
          outfit: ['Outfit'],
        },
        mapFloat: {
          "0%, 100%": { transform: "translateX(-50%) translateY(-50%) scale(1)" },
          "50%": { transform: "translateX(-50%) translateY(-53%) scale(1.1)" },
        },
        pulseSlow: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.72" },
          "50%": { transform: "scale(1.07)", opacity: "1" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-10px) translateX(6px)" },
        },
        floatSlow2: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(10px) translateX(-6px)" },
        },
        iconFloat: {
          "0%, 100%": { transform: "translateY(0px) scale(1.08)" },
          "50%": { transform: "translateY(-10px) scale(1)" },
        },
      },
      animation: {
        mapFloat: "mapFloat 6s ease-in-out infinite",
        pulseSlow: "pulseSlow 3.1s ease-in-out infinite",
        floatSlow: "floatSlow 4.5s ease-in-out infinite",
        floatSlow2: "floatSlow2 5.2s ease-in-out infinite",
        iconFloat: "iconFloat 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};