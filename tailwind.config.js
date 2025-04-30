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
        'midnight': '#242423',
        'midnight-opacity': '#47474650',
        'midnight-text': '#BDBDBD',
        'midnight-purple': '#7F6EEE',
        'midnight-purple-shadow': '#9a8df2'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ],
}
