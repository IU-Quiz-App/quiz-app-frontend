module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  safelist: [
    {
      pattern: /(bg|text|stroke|from|to|border|shadow)-(blue|cyan|yellow|orange|pink|red|green|gray)-(50|100|200|300|400|500|600|700|800|900|950)/,
      variants: ['hover']
    },
  ],

  theme: {
    extend: {
      fontFamily: {
        'sans': ['Helvetica', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};

