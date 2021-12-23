module.exports = {
  mode : "jit",
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        full : '100%',
        half: '50%',
        quarter : '25%',
        ten : '10%',
        fit : 'fit-content'
      },
      width: {
        full : '100%',
        half: '50%',
        quarter : '25%',
        ten : '10%',
        fit : 'fit-content'
      },
      minWidth: {
        28: '7rem',
        37: '9.375rem',
        75: '18.75rem'
      },
      minHeight: {
        28: '7rem',
        75: '18.75rem'
      },
      screens : {
        less_md : {max :'768px'}
      }
    },
    
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
