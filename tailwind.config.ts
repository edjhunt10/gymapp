import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        surface: "#141414",
        elevated: "#1c1c1c",
        border: "#2a2a2a",
        muted: "#6b6b6b",
        text: "#f5f5f5",
        accent: "#d4ff3a",
        "accent-dim": "#a3c92e",
        danger: "#ff4d4d",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        DEFAULT: "6px",
        lg: "10px",
        xl: "14px",
      },
    },
  },
  plugins: [],
};
export default config;
