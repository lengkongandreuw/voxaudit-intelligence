/** @type {import('tailwindcss').Config} */
// Semua warna membaca CSS variable dari src/index.css, sehingga tema terang/gelap
// dan white-label agensi cukup mengganti variable, bukan class.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        shell: {
          DEFAULT: v('shell-bg'),
          surface: v('shell-surface'),
          border: v('shell-border'),
          text: v('shell-text'),
          muted: v('shell-muted'),
        },
        canvas: v('canvas'),
        surface: v('surface'),
        'surface-2': v('surface-2'),
        line: v('line'),
        ink: v('ink'),
        muted: v('muted'),
        primary: {
          DEFAULT: v('primary'),
          strong: v('primary-strong'),
          soft: v('primary-soft'),
        },
        ai: { DEFAULT: v('ai'), soft: v('ai-soft') },
        highlight: v('highlight'),
        good: { DEFAULT: v('good'), soft: v('good-soft') },
        watch: { DEFAULT: v('watch'), soft: v('watch-soft') },
        critical: { DEFAULT: v('critical'), soft: v('critical-soft') },
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'IBM Plex Sans Arabic', 'sans-serif'],
        arabic: ['IBM Plex Sans Arabic', 'Inter', 'sans-serif'],
      },
      fontSize: {
        // Minimum 14px di aplikasi (aturan Phase 1)
        xs: ['0.875rem', { lineHeight: '1.25rem' }],
        sm: ['0.875rem', { lineHeight: '1.375rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
      },
      spacing: {
        sidebar: '248px',
        'sidebar-collapsed': '72px',
      },
      maxWidth: { content: '1440px' },
      borderRadius: { card: '12px' },
      boxShadow: {
        card: '0 1px 2px rgb(16 24 40 / 0.04)',
        pop: '0 8px 24px rgb(16 24 40 / 0.12)',
      },
    },
  },
  plugins: [],
};
