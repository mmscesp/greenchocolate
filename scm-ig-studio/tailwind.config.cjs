/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        'brand-base': 'var(--color-brand-base)',
        'brand-panel': 'var(--color-brand-panel)',
        'brand-panel-light': 'var(--color-brand-panel-light)',
        'brand-main': 'var(--color-brand-main)',
        'brand-muted': 'var(--color-brand-muted)',
        'brand-divider': 'var(--color-brand-divider)',
        'brand-teal': 'var(--color-brand-teal)',
        'brand-teal-soft': 'var(--color-brand-teal-soft)',
        'brand-saffron': 'var(--color-brand-saffron)',
        'brand-olive': 'var(--color-brand-olive)',
      },
    },
  },
  plugins: [],
};
