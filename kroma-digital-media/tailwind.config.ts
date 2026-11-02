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
        background: "#05060a",
        surface: "#0a0c14",
        panel: "#0d1020",
        foreground: "#f4f6fb",
        muted: "#8b92a8",
        border: "rgba(244, 246, 251, 0.08)",
        accent: {
          cyan: "#4df0ff",
          blue: "#5b7fff",
          purple: "#9b6bff",
          pink: "#ff6bd6",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(244,246,251,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,246,251,0.05) 1px, transparent 1px)",
        "glow-radial":
          "radial-gradient(circle at 50% 0%, rgba(91,127,255,0.25), transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(91,127,255,0.45)",
        "glow-cyan": "0 0 40px -10px rgba(77,240,255,0.4)",
        "glow-purple": "0 0 40px -10px rgba(155,107,255,0.45)",
        card: "0 1px 0 0 rgba(244,246,251,0.06) inset, 0 20px 60px -20px rgba(0,0,0,0.6)",
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        "float-slow": "float 14s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "spin-slow": "spin 22s linear infinite",
        drift: "drift 30s linear infinite",
        "fade-up": "fadeUp 0.8s ease forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" },
        },
        drift: {
          "0%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(3%, -4%)" },
          "100%": { transform: "translate(0,0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      maxWidth: {
        content: "1360px",
      },
    },
  },
  plugins: [],
};
export default config;
