const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',

        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/**/*.js",
        "./resources/**/**/*.jsx",
        "./resources/**/*.vue",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
            },
            transitionProperty: {
                'height': 'height'
            },
            gridTemplateColumns: {
                // grid main container
                'mainContainer': 'calc(66.6666% - 10px) calc(33.3333% - 10px)',
            },
            backgroundImage: {
                'caret-down': "url('/images/icons/caret-down.svg')",
              }
        },
        backgroundPosition: {
            'right-center': 'right 15px center',
        }
    },

    plugins: [
        // require('@tailwindcss/forms')
        require('tailwind-scrollbar'),
    ],

    variants: {
        extend: {
            opacity: ['disabled'],
        },
        scrollbar: ['rounded'],
    },
};
