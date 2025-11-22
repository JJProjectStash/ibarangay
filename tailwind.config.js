/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern:
        /^(bg|text|border|shadow|backdrop|from|to|via|p|m|animate|rounded|transition|ring|backdrop-blur|hover|dark|grid|flex|gap|h-|w-).*/,
    },
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
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
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
          light: "hsl(var(--accent-light))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        error: "hsl(var(--error))",
        info: "hsl(var(--info))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "fade-in": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: 0, transform: "translateX(20px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        "slide-in-left": {
          from: { opacity: 0, transform: "translateX(-20px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: 0, transform: "scale(0.95)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
        "slide-in-left": "slide-in-left 0.4s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        shimmer: "shimmer 2s infinite",
        float: "float 3s ease-in-out infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [
    // Add a tiny plugin so utilities that reference custom color names
    // (e.g. bg-background, text-foreground, ring-offset-background)
    // exist in the base layer. This lets @apply inside @layer base use
    // these names without changing project CSS.
    function ({ addUtilities, theme }) {
      // Generate utilities for all top-level theme colors used in the project
      // and a few common opacity variants. This ensures classes such as
      // `bg-background`, `bg-background/50`, `text-foreground` and
      // `ring-offset-background` exist at build time so @apply resolves.
      const colorNames = [
        "border",
        "input",
        "ring",
        "background",
        "foreground",
        "primary",
        "primary-foreground",
        "primary-light",
        "primary-dark",
        "secondary",
        "secondary-foreground",
        "destructive",
        "destructive-foreground",
        "muted",
        "muted-foreground",
        "accent",
        "accent-foreground",
        "accent-light",
        "popover",
        "popover-foreground",
        "card",
        "card-foreground",
        "success",
        "warning",
        "error",
        "info",
      ];

      const alphaVariants = {
        "/5": "0.05",
        "/10": "0.1",
        "/30": "0.3",
        "/40": "0.4",
        "/50": "0.5",
      };

      const utilities = {};

      // plain name utilities
      for (const name of colorNames) {
        // convert e.g. primary-foreground -> text-primary-foreground
        utilities[`.text-${name}`] = { color: theme(`colors.${name}`) };
        utilities[`.bg-${name}`] = { backgroundColor: theme(`colors.${name}`) };
        utilities[`.border-${name}`] = { borderColor: theme(`colors.${name}`) };
        // ring-offset for background specifically
        if (name === "background") {
          utilities[".ring-offset-background"] = {
            "--tw-ring-offset-color": theme("colors.background"),
          };
        }
      }

      // alpha variants for backgrounds
      for (const name of [
        "background",
        "muted",
        "primary",
        "accent",
        "destructive",
      ]) {
        const base = `var(--${name})`;
        // If theme contains a literal color (e.g. hsl(var(--background))) use it.
        // For safety prefer theme('colors.<name>') when available.
        for (const [suffix, value] of Object.entries(alphaVariants)) {
          // Build the hsl(var(--name) / alpha) pattern — Theme already stores colors
          // in the form `hsl(var(--...))`, so we can inject the alpha fraction.
          utilities[`.bg-${name}\\${suffix}`] = {
            backgroundColor: `hsl(var(--${name}) / ${value})`,
          };
        }
      }

      addUtilities(utilities, { variants: ["responsive", "hover"] });
    },
  ],
};
