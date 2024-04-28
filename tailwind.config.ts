import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  important: true,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1360px",
      },
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
          },
        },
      },
      boxShadow: {
        input:
          "0px 1px 0px -1px var(--tw-shadow-color), 0px 1px 1px -1px var(--tw-shadow-color), 0px 1px 2px -1px var(--tw-shadow-color), 0px 2px 4px -2px var(--tw-shadow-color), 0px 3px 6px -3px var(--tw-shadow-color)",
        highlight:
          "inset 0px 0px 0px 1px var(--tw-shadow-color), inset 0px 1px 0px var(--tw-shadow-color)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        aboreto: ["var(--font-aboreto)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      colors: {
        neutral: {
          750: "#313131",
        },
      },

      animation: {
        "accordon-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("windy-radix-palette"),
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
  presets: [require("windy-radix-palette")],
};
export default config;
