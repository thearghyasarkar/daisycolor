import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fbf7ee",
        paper: "#fffdf7",
        ink: "#4a4139",
        muted: "#8b8175",
        sage: "#9aab8d",
        "sage-deep": "#6d7f63",
        rose: "#ddaea9",
        lavender: "#b7a8c9",
        sky: "#a9c4d4",
        butter: "#e9d6a6",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -18px rgba(74, 65, 57, 0.35)",
        card: "0 14px 35px -22px rgba(74, 65, 57, 0.45)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(6deg)" },
        },
        petal: {
          "0%": { transform: "translate3d(0, -10px, 0) rotate(-12deg)", opacity: "0" },
          "12%": { opacity: "0.75" },
          "80%": { opacity: "0.5" },
          "100%": { transform: "translate3d(28px, 110px, 0) rotate(35deg)", opacity: "0" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(0.82)" },
          "40%": { transform: "scale(1.12)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        petal: "petal 9s linear infinite",
        breathe: "breathe 10s ease-in-out infinite",
        fadeUp: "fadeUp 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
