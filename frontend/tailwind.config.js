/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#dbe5f2',
          200: '#bacde3',
          300: '#8eadd0',
          400: '#5c86b8',
          500: '#3a669f',
          600: '#2b5083',
          700: '#223f69',
          800: '#1c3455',
          900: '#0B1F3A', // Brand Primary
          950: '#061122',
        },
        emerald: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16A34A', // Brand Secondary
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        beu: {
          navy: '#0B1F3A',
          green: '#16A34A',
          light: '#F5F8FC',
          dark: '#172033',
          muted: '#64748B',
          accent: '#F59E0B',
          card: '#FFFFFF',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(11, 31, 58, 0.05), 0 1px 2px -1px rgba(11, 31, 58, 0.05)',
        'card': '0 4px 6px -1px rgba(11, 31, 58, 0.07), 0 2px 4px -2px rgba(11, 31, 58, 0.05)',
        'card-hover': '0 12px 24px -4px rgba(11, 31, 58, 0.12), 0 4px 6px -2px rgba(11, 31, 58, 0.05)',
        'dropdown': '0 10px 25px -5px rgba(11, 31, 58, 0.15), 0 8px 10px -6px rgba(11, 31, 58, 0.1)',
      }
    },
  },
  plugins: [],
}
