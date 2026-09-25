/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FAFAF9',
          surface: '#FFFFFF',
          subtle: '#F4F4F5',
          muted: '#EAEAEA',
          border: '#E4E4E7',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#FAFAF9',
          card: '#FFFFFF',
          border: '#E4E4E7',
        },
        ink: {
          DEFAULT: '#18181B', // Rich Zinc 900 - crisp, modern, luxury obsidian
          charcoal: '#27272A', // Zinc 800
          muted: '#52525B', // Zinc 600 - high contrast, readable
          subtle: '#71717A', // Zinc 500
          light: '#A1A1AA',
        },
        terracotta: {
          50: '#FDF5F3',
          100: '#FAECE8',
          200: '#F4D5CC',
          300: '#E9B2A4',
          400: '#D98772',
          500: '#C45F46',
          600: '#A7462E', // Elegant signature copper carnelian
          700: '#87341F',
          800: '#6C2A1A',
          900: '#522115',
        },
        forest: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          atelier: '#233F33', // Deep artisan forest green
        },
        sage: {
          50: '#F2F6F3',
          100: '#E3EDE6',
          200: '#C7DBCB',
          300: '#A4C3AC',
          400: '#7AA385',
          500: '#568462',
          600: '#42694D',
          700: '#32503B',
          800: '#273E2E',
          900: '#1E3024',
        },
        bronze: {
          50: '#FCF9F3',
          100: '#F7F0E2',
          500: '#B68442',
          600: '#996A2E',
          700: '#7B5221',
        },
        amber: {
          warm: '#D97706',
          soft: '#FEF3C7',
        },
        // Backwards compatibility with previous classes
        blush: {
          50: '#FDF6F4',
          100: '#FAEAE5',
          200: '#F4D3C9',
          300: '#EAAFA0',
          400: '#DC846E',
          500: '#C95D42',
          600: '#B24A31',
          700: '#8F3924',
          800: '#6E2E1F',
          900: '#542419',
        },
        cream: '#FFFFFF',
        yarn: {
          pink: '#EAAFA0',
          blush: '#B24A31',
          gold: '#D97706',
          dark: '#0F172A',
        }
      },
      fontFamily: {
        display: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        serif: ['Fraunces', 'Playfair Display', 'serif'],
        body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.035em',
        editorial: '0.18em',
      },
      boxShadow: {
        '2xs': '0 1px 2px rgba(0,0,0,0.02)',
        'xs': '0 1px 2px rgba(0,0,0,0.04)',
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px -4px rgba(0,0,0,0.04)',
        'subtle': '0 1px 3px rgba(28,25,23,0.04), 0 4px 12px rgba(28,25,23,0.03)',
        'lifted': '0 10px 30px -10px rgba(28,25,23,0.08), 0 2px 6px -1px rgba(28,25,23,0.04)',
        'float': '0 20px 40px -15px rgba(28,25,23,0.12)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.4s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
