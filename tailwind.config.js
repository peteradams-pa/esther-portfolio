/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Solar Blue family
        'sol-ink':   '#0B1F3A',
        'sol-deep':  '#0D2D4D',
        'sol-sky':   '#1A5276',
        'sol-mid':   '#2980B9',
        'sol-light': '#5DADE2',
        // Emerald Green family
        'sol-leaf':  '#1E8449',
        'sol-mint':  '#27AE60',
        'sol-sage':  '#A9DFBF',
        // Amber / Solar family
        'sol-amber': '#F39C12',
        'sol-gold':  '#F1C40F',
        'sol-warm':  '#FAD7A0',
        // Neutrals
        'sol-ash':   '#F4F6F9',
        'sol-fog':   '#E8EDF3',
        'sol-steel': '#8899AA',
        'sol-smoke': '#C5CDD8',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        'xl2': '1.25rem',
        'xl3': '1.5rem',
      },
      boxShadow: {
        'solar': '0 20px 60px rgba(11,31,58,0.12)',
        'solar-lg': '0 32px 80px rgba(11,31,58,0.18)',
        'glow-amber': '0 8px 32px rgba(243,156,18,0.25)',
        'glow-sky':   '0 8px 32px rgba(26,82,118,0.25)',
      },
      backgroundImage: {
        'hero-grid': "linear-gradient(rgba(41,128,185,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(41,128,185,0.06) 1px,transparent 1px)",
        'hero-gradient': 'linear-gradient(135deg,#0B1F3A 0%,#0D2D4D 40%,#0a1928 100%)',
        'card-gradient': 'linear-gradient(135deg,rgba(243,156,18,0.04) 0%,transparent 60%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.sol-ink'),
            a: { color: theme('colors.sol-sky') },
            h1: { fontFamily: 'var(--font-display)', fontWeight: '600' },
            h2: { fontFamily: 'var(--font-display)', fontWeight: '600' },
            h3: { fontFamily: 'var(--font-display)', fontWeight: '600' },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
