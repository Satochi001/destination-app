/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,vue}',      // Path to your pages
    './components/**/*.{js,ts,vue}', // Path to your components
    './layouts/**/*.{js,ts,vue}',    // Path to your layouts
    './plugins/**/*.{js,ts,vue}'     // Path to your plugins
  ],
  theme: {
    extend: {
      zIndex: {
        '100': '100',
        '50': '50'
      },
      spacing: {
        '12': '3rem',  // 48px
        '14': '3.5rem', // 56px
        '16': '4rem',   // 64px
        '20': '5rem',   // 80px
        '24': '6rem',   // 96px
        '28': '7rem',   // 112px
        '30': '9rem',
        '32': '11rem'
      },
      screens: {
        'xs': '480px', // Custom breakpoint for screens 480px and above
      },
    },
  },
  plugins: [],
}
