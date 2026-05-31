import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        klas: {
          ivory: "#FAF7F2",
          rose: "#F4D6D1",
          coral: "#E8918A",
          deep: "#7C1F1A",
          ink: "#1A1411",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(124,31,26,0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
