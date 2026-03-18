import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fhenix: {
          primary: "#00E5FF", // Bright Cyan
          secondary: "#2979FF", // Electric Blue
          dark: "#020617", // Deepest Background
          card: "#0F172A", // Card Background
          border: "#1E293B", // Border Color
          text: "#F8FAFC", // Main Text
          muted: "#94A3B8", // Muted Text
        }
      },
      fontFamily: {
        sans: ['ClashDisplay', 'var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        display: ['ClashDisplay', 'sans-serif'],
        pixel: ['Visitor', 'monospace'],
      },
      backgroundImage: {
        'fhenix-gradient': 'linear-gradient(to right, #00E5FF, #2979FF)',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        fhenixlight: {
          "primary": "#00E5FF",
          "secondary": "#2979FF",
          "accent": "#00E5FF",
          "neutral": "#0F172A",
          "base-100": "#FFFFFF",
          "base-200": "#F1F5F9",
          "base-300": "#E2E8F0",
          "base-content": "#0F172A",
          "info": "#00E5FF",
          "success": "#00C853",
          "warning": "#FFD600",
          "error": "#FF1744",
        },
        fhenixdark: {
          "primary": "#00E5FF",
          "secondary": "#2979FF",
          "accent": "#00E5FF",
          "neutral": "#1E293B",
          "base-100": "#0F172A",
          "base-200": "#020617",
          "base-300": "#1E293B",
          "base-content": "#F8FAFC",
          "info": "#00E5FF",
          "success": "#00C853",
          "warning": "#FFD600",
          "error": "#FF1744",
        },
      },
    ],
  },
};
export default config;
