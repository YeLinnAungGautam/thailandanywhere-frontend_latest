/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        tablet: { min: "769px", max: "1024px" },
        ipad: { min: "768px", max: "1024px", orientation: "portrait" },
        "ipad-pro": { min: "1024px", max: "1366px" },
        mobile: { max: "768px" },
      },
    },
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
  },
  plugins: [],
};
