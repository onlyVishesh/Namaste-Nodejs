/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Primary Colors */
        primary: "var(--color-primary)", // Primary Blue
        secondary: "var(--color-secondary)", // Secondary Green
        accent1: "var(--color-accent-1)", // Accent Amber
        accent2: "var(--color-accent-2)", // Accent Red

        /* Background Colors */
        bg: "var(--color-bg)", // Light Gray Background
        cardBg: "var(--color-card-bg)", // White Card Background

        /* Text Colors */
        text: "var(--color-text)", // Dark Gray / Black Text
        textMuted: "var(--color-text-muted)", // Medium Gray Text (for secondary text)

        /* Border & Divider Colors */
        border: "var(--color-border)", // Light Gray Border
        hover: "var(--color-hover)", // Darker Blue on Hover

        /* Accent & Tint Colors */
        primaryTint: "var(--color-primary-tint)", // Light Blue Tint (Primary)
        secondaryTint: "var(--color-secondary-tint)", // Light Green Tint (Secondary)

        /* Status Colors */
        success: "var(--color-success)", // Green for success
        warning: "var(--color-warning)", // Amber for warnings
        error: "var(--color-error)", // Red for errors
        info: "var(--color-info)", // Blue for info messages

        /* Shadow & Neutral Colors */
        shadow: "var(--color-shadow)", // Light Shadow for elements
        lightGray: "var(--color-light-gray)", // Lighter Gray (use for backgrounds or light text)
      },
      boxShadow: {
        default: "0 2px 4px rgba(0, 0, 0, 0.1)", // Default shadow
        lg: "0 10px 15px rgba(0, 0, 0, 0.1)", // Large shadow for deeper depth
        md: "0 4px 6px rgba(0, 0, 0, 0.1)", // Medium shadow for cards and buttons
        dark: "0 10px 20px rgba(0, 0, 0, 0.3)", // Darker shadow for dark mode
      },
      extend: {
        spacing: {
          "space-4": "1rem",
          "space-8": "2rem",
        },
      },
    },
    screens: {
      "3xs": "320px",
      // => @media (min-width: 320px) { ... }
      "2xs": "425px",
      // => @media (min-width: 425px) { ... }
      xs: "540px",
      // => @media (min-width:540px) { ... }
      sm: "640px",
      // => @media (min-width: 640px) { ... }
      md: "768px",
      // => @media (min-width: 768px) { ... }
      lg: "1024px",
      // => @media (min-width: 1024px) { ... }
      xl: "1280px",
      // => @media (min-width: 1280px) { ... }
      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [require("tailwindcss-debug-screens")],
};
