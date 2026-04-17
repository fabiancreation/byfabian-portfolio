import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ground: "#F6F2EB",
        ink: "#161513",
        "ink-soft": "#3a3733",
        "ink-mute": "#8a857d",
        rule: "#d9d2c5",
        accent: "#9B3A1A",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.035em",
        wider2: "0.18em",
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 10vw, 8.5rem)", { lineHeight: "0.95", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(2.5rem, 6vw, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
      },
    },
  },
  plugins: [],
};

export default config;
