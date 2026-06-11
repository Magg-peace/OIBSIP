/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Indigo 600
          dark:    '#4338CA',
          light:   '#EEF2FF',
        },
        secondary: '#EC4899', // Pink 500
        surface: '#FFFFFF',
        bg: '#FAFAFC',
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4F46E5 0%, #EC4899 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%)',
      },
      boxShadow: {
        'card':      '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
        'card-hover':'0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)',
        'primary':   '0 8px 20px rgba(79, 70, 229, 0.25)',
      },
      borderRadius: {
        'xl':  '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
    },
  },
  plugins: [],
};
