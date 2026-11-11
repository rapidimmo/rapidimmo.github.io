/** @type {import('tailwindcss').Config} */
// Charte RapidImmo — tirée du logo : bleu nuit profond + or.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Bleu nuit (structure, texte fort, boutons principaux)
        primary: {
          DEFAULT: '#0B2A7A',
          50: '#F2F5FC',
          100: '#E3E9F7',
          200: '#C3D0EE',
          300: '#93A9DE',
          400: '#5B7BCB',
          500: '#2F55B8',
          600: '#1A3F9E',
          700: '#0B2A7A',
          800: '#081F5C',
          900: '#061644',
          950: '#030C2B',
        },
        // Or (accents, appels à l'action secondaires)
        secondary: {
          DEFAULT: '#E9A300',
          50: '#FFF9EB',
          100: '#FEF0C7',
          200: '#FCE08A',
          300: '#F9CB4A',
          400: '#F5B820',
          500: '#E9A300',
          600: '#C78400',
          700: '#9E6503',
        },
        ivory: '#FAF9F6',
        whatsapp: '#25D366',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(3,12,43,0.04), 0 8px 24px -12px rgba(3,12,43,0.12)',
        lift: '0 2px 4px rgba(3,12,43,0.04), 0 24px 48px -20px rgba(3,12,43,0.25)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'fade-up': 'fade-up .7s cubic-bezier(.2,.7,.2,1) both',
      },
    },
  },
  plugins: [],
}
