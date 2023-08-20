/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        "light-gray": "#F1FAF9",
        "light": "#f1faf9c6",
        secondary: '#155984',
        'footer-bg': '#212B36',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
           screens: {
           '2xl': '1436px',
        // => @media (min-width: 1536px) { ... }
    }
    },
    
 
  },
  plugins: [],
};
