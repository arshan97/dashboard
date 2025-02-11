/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: {
    background: "#000000",
    foreground: "#ffffff",
    card: "#464646",
    "card-foreground": "#ffffff",
    popover: "#464646",
    "popover-foreground": "#ffffff",
    primary: "#ffffff",
    "primary-foreground": "#000000",
    secondary: "#737373",
    "secondary-foreground": "#ffffff",
    muted: "#737373",
    "muted-foreground": "#a3a3a3",
    accent: "#737373",
    "accent-foreground": "#ffffff",
    destructive: "#ff0000",
    "destructive-foreground": "#ffffff",
    border: "#737373",
    input: "#737373",
    ring: "#ffffff",
  },
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        flashBorderGreen: {
          "0%, 100%": { borderColor: "rgba(34, 197, 94, 0.2)" },
          "50%": { borderColor: "rgba(34, 197, 94, 1)" },
        },
        flashBorderYellow: {
          "0%, 100%": { borderColor: "rgba(234, 179, 8, 0.2)" },
          "50%": { borderColor: "rgba(234, 179, 8, 1)" },
        },
        flashBorderRed: {
          "0%, 100%": { borderColor: "rgba(239, 68, 68, 0.2)" },
          "50%": { borderColor: "rgba(239, 68, 68, 1)" },
        },
        flashIconGreen: {
          "0%, 100%": { color: "rgba(34, 197, 94, 0.5)" },
          "50%": { color: "rgba(34, 197, 94, 1)" },
        },
        flashIconYellow: {
          "0%, 100%": { color: "rgba(234, 179, 8, 0.5)" },
          "50%": { color: "rgba(234, 179, 8, 1)" },
        },
        flashIconRed: {
          "0%, 100%": { color: "rgba(239, 68, 68, 0.5)" },
          "50%": { color: "rgba(239, 68, 68, 1)" },
        },
      },
      animation: {
        "flash-border-green":
          "flashBorderGreen 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flash-border-yellow":
          "flashBorderYellow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flash-border-red":
          "flashBorderRed 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flash-icon-green":
          "flashIconGreen 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flash-icon-yellow":
          "flashIconYellow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flash-icon-red":
          "flashIconRed 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
