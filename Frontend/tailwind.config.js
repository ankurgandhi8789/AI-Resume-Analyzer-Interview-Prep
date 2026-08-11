/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1120",
        surface: "#121B31",
        "surface-2": "#1B2740",
        border: "#26324A",
        amber: {
          DEFAULT: "#E8B75A",
          soft: "#F3D08C",
        },
        teal: {
          DEFAULT: "#4FD1C5",
        },
        coral: "#F97066",
        ivory: "#EDEFF7",
        muted: "#8A93A6",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 50% 0%, rgba(232,183,90,0.12), transparent 60%)",
      },
      keyframes: {
        scan: {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        scan: "scan 2.6s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
