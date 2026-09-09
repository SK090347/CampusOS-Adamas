import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f5f2",
          100: "#ebe8e1",
          200: "#d6d1c6",
          300: "#b8b0a0",
          400: "#968c7a",
          500: "#7a7162",
          600: "#615a4f",
          700: "#4d4840",
          800: "#3a3631",
          900: "#25221f",
          950: "#12100e",
        },
        campus: {
          50: "#fbf7ee",
          100: "#f5ecd6",
          200: "#ead9ab",
          300: "#dbc074",
          400: "#cda84a",
          500: "#c4a35a",
          600: "#a8843a",
          700: "#866530",
          800: "#6e522c",
          900: "#5c4528",
          950: "#352414",
        },
        cream: {
          DEFAULT: "#faf6ee",
          soft: "#f7f1e5",
          deep: "#efe6d4",
        },
        accent: {
          DEFAULT: "#c4a35a",
          soft: "#f5ecd6",
          ink: "#12100e",
        },
      },
      fontFamily: {
        sans: ["var(--font-ui)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(18,16,14,0.04), 0 4px 16px rgba(18,16,14,0.05)",
        lift: "0 2px 4px rgba(18,16,14,0.05), 0 14px 36px rgba(18,16,14,0.09)",
        gold: "0 0 0 1px rgba(196,163,90,0.25), 0 8px 24px rgba(168,132,58,0.12)",
      },
      borderRadius: {
        xl2: "1rem",
      },
      backgroundImage: {
        "campus-mesh":
          "radial-gradient(ellipse at 20% 0%, rgba(196,163,90,0.12), transparent 50%), radial-gradient(ellipse at 90% 10%, rgba(239,230,212,0.8), transparent 45%)",
      },
    },
  },
  plugins: [],
};
export default config;
