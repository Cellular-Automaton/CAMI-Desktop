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
        'midnight-purple-dark': '#6B5BB8',
        'midnight-purple-shadow': '#9a8df2',
        'midnight-red': '#C62828',
        'midnight-blue': '#1E88E5',
        'midnight-green': '#2E7D32',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ],
}
