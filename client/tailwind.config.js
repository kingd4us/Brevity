/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#f9f6f2', // Warm Off-White for the main background
        'surface': '#ffffff',    // White for primary cards/surfaces
        'primary': '#d1d1d1',    // Light Gray for primary buttons/elements
        'secondary': '#e1dbd6', // Beige for secondary elements
        'muted': '#e2e2e2',      // Very Light Gray for borders or subtle backgrounds
        'text': '#1A1A1A',        // Black for primary text
        'border': '#1A1A1A',      // Black for Neubrutalism borders/shadows
      },
    },
  },
  plugins: [],
}