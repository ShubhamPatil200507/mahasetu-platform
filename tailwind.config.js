/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        govNavy: {
          50: '#EDF2F7',
          100: '#D5DFEB',
          200: '#ABC0D8',
          600: '#253870',
          700: '#1B2A5C',
          800: '#142048',
          900: '#0B132B',
          950: '#070C1D',
        },
        govSaffron: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          400: '#FB923C',
          500: '#F28C28',
          600: '#E65100',
          700: '#C2410C',
        },
        govGreen: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#138808',
          800: '#166534',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
        marathi: ['Nirmala UI', 'Mukta', 'Noto Sans Devanagari', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
