/** @type {import('tailwindcss').Config} */

// Semantic tokens are CSS variables (RGB triplets) defined in src/index.css.
// They flip between light and dark via the `.dark` class so utilities like
// `bg-surface`, `text-ink`, and alpha modifiers (`bg-surface/80`) all work.
const semantic = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- Flipping semantic surfaces & text ---
        canvas: {
          DEFAULT: semantic('canvas'),
          subtle: semantic('canvas-subtle'),
          muted: semantic('canvas-muted'),
          border: semantic('canvas-border'),
        },
        surface: {
          DEFAULT: semantic('surface'),
          secondary: semantic('canvas-subtle'),
          card: semantic('surface'),
          border: semantic('canvas-border'),
          raised: semantic('surface-raised'),
        },
        ink: {
          DEFAULT: semantic('ink'),
          charcoal: semantic('ink-charcoal'),
          muted: semantic('ink-muted'),
          subtle: semantic('ink-subtle'),
          light: semantic('ink-light'),
        },
        // Always-dark surfaces (buttons, badges, announcement bar) — stay dark in both modes
        elevated: {
          DEFAULT: semantic('elevated'),
          2: semantic('elevated-2'),
        },
        // Deepest backdrop (footer, modals)
        night: semantic('night'),
        'on-elevated': semantic('on-elevated'),
        // Accent flips for contrast on dark backgrounds
        accent: {
          DEFAULT: semantic('accent'),
          soft: semantic('accent-soft'),
          hover: semantic('accent-hover'),
        },

        // --- Static brand ramps (read well in both modes) ---
        terracotta: {
          50: '#FBF1EE',
          100: '#F6E1DA',
          200: '#EBC3B6',
          300: '#DDA08C',
          400: '#CB7B61',
          500: '#B4573C', // signature
          600: '#A24A31',
          700: '#833A26',
          800: '#68301F',
          900: '#4F2718',
        },
        forest: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          atelier: '#233F33',
        },
        sage: {
          50: '#F2F6F3',
          100: '#E4EDE7',
          200: '#C9DBCE',
          300: '#A6C4AE',
          400: '#87A98F',
          500: '#6E8F76', // signature
          600: '#56735E',
          700: '#425A49',
          800: '#314237',
          900: '#233028',
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
        // Backwards compatibility
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
        cream: semantic('surface'),
        yarn: {
          pink: '#EAAFA0',
          blush: '#B24A31',
          gold: '#D97706',
          dark: '#0F172A',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        serif: ['Fraunces', 'Playfair Display', 'serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.035em',
        editorial: '0.18em',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        '2xs': '0 1px 2px rgb(26 24 21 / 0.03)',
        'xs': '0 1px 2px rgb(26 24 21 / 0.05)',
        'card': '0 1px 3px rgb(26 24 21 / 0.05), 0 10px 28px -8px rgb(26 24 21 / 0.08)',
        'subtle': '0 1px 3px rgb(26 24 21 / 0.05), 0 6px 16px -6px rgb(26 24 21 / 0.06)',
        'lifted': '0 12px 34px -12px rgb(26 24 21 / 0.16), 0 3px 8px -2px rgb(26 24 21 / 0.06)',
        'float': '0 24px 48px -18px rgb(26 24 21 / 0.22)',
        'glow': '0 8px 30px -6px rgb(180 87 60 / 0.35)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'shimmer': 'shimmer 2.2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [
    // `can-hover:` only applies on devices with a real pointer (mouse/trackpad).
    // Touch devices get the un-prefixed styles, so hover-only controls
    // (quick-add bars, preview buttons) stay visible and tappable there.
    function ({ addVariant }) {
      addVariant('can-hover', '@media (hover: hover)')
    },
  ],
}
