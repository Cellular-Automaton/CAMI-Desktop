/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
      mono: ['JetBrains Mono', 'monospace'],
    },
      colors: {
        'midnight': '#0A0A0A',
        'midnight-opacity': '#191919',
        'midnight-text': '#BDBDBD',

        'midnight-red': '#C62828',
        'midnight-blue': '#1E88E5',
        'midnight-green': '#2E7D32',

        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',

        background: 'var(--color-background)',
        backgroundAlt: 'var(--color-background-alt)',
        text: 'var(--color-text)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ],
}
