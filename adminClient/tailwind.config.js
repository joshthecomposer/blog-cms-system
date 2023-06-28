/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        oswald: ["Oswald"],
        raleWay: ["Raleway"],
        wix: ["Wix Madefor Display"],
        bel: ["Belanosima"]
      },
    },
  },
  plugins: [],
};
