/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Pangolin", "cursive"],
        body: ["Roboto", "sans-serif"],
      },
      fontSize: {
        "fluid-sm": ["clamp(0.8rem, 2vw, 1rem)", { lineHeight: "1.4" }],
        "fluid-base": ["clamp(1rem, 2.5vw, 1.25rem)", { lineHeight: "1.5" }],
        "fluid-lg": ["clamp(1.25rem, 3vw, 1.563rem)", { lineHeight: "1.4" }],
        "fluid-xl": ["clamp(1.563rem, 4vw, 1.953rem)", { lineHeight: "1.3" }],
        "fluid-2xl": ["clamp(1.953rem, 5vw, 2.441rem)", { lineHeight: "1.2" }],
        "fluid-3xl": ["clamp(2.441rem, 6vw, 3.052rem)", { lineHeight: "1.2" }],
      },
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
        gamellito: {
          orange: "hsl(var(--gamellito-orange))",
          "mae-red": "hsl(var(--gamellito-mae-red))",
          "hospital-purple": "hsl(var(--gamellito-hospital-purple))",
          "bg-yellow": "hsl(var(--gamellito-bg-yellow))",
          "health-green": "hsl(var(--gamellito-health-green))",
          purple: "hsl(var(--gamellito-purple))",
          "purple-light": "hsl(var(--gamellito-purple-light))",
          space: "hsl(var(--gamellito-space))",
          green: "hsl(var(--gamellito-green))",
          blue: "hsl(var(--gamellito-blue))",
          yellow: "hsl(var(--gamellito-yellow))",
          pink: "hsl(var(--gamellito-pink))",
        },
        /* Design System tokens — usados no /diario */
        ds: {
          sun:    "#FFC400",
          orange: "#F26A00",
          lilac:  "#9B8CF0",
          purple: "#6E59C9",
          cream:  "#FFF3C9",
          ink:    "#2B2233",
          white:  "#FFFFFF",
          "game-red":     "#EE2B2B",
          "game-blue":    "#37B6E6",
          "game-green":   "#8DC63F",
          "game-pink":    "#F25CA2",
          "game-magenta": "#C82FA0",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        lg: "var(--radius-lg)",
        md: "var(--radius)",
        sm: "var(--radius-sm)",
        /* DS radii */
        "ds-sm":   "10px",
        "ds-md":   "16px",
        "ds-lg":   "24px",
        "ds-xl":   "32px",
        "ds-pill": "999px",
      },
      boxShadow: {
        "ds-pop":    "4px 4px 0 #2B2233",
        "ds-pop-lg": "6px 6px 0 #2B2233",
        "ds-pop-sm": "2px 2px 0 #2B2233",
        "ds-press":  "1px 1px 0 #2B2233",
        "ds-soft":   "0 8px 24px rgba(43,34,51,0.16)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fridgeShake: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-4deg)" },
          "75%": { transform: "rotate(4deg)" },
        },
        gamellitoCelebrate: {
          "0%": { transform: "translateX(-50%) scale(1)" },
          "40%": { transform: "translateX(-50%) scale(1.12)" },
          "100%": { transform: "translateX(-50%) scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fridge-shake": "fridgeShake 0.45s ease-in-out",
        "gamellito-celebrate": "gamellitoCelebrate 0.55s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
