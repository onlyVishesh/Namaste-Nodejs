/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    daisyui: {
      themes: ["light", "dark", "dim"],
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
  plugins: [require("daisyui"), require("tailwindcss-debug-screens")],
};
