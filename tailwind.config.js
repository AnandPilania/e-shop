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
            screens: {
                '3xl': { 'raw': '(min-width: 1620px)' },
            },
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
            },
            transitionProperty: {
                'height': 'height',
                'maxHeight': 'max-height',
            },
            gridTemplateColumns: {
                // grid main container !!! pas utilisé !!!
                'mainContainer': 'calc(66.6666% - 10px) calc(33.3333% - 10px)',
            },
            backgroundImage: {
                'caret-down': "url('/images/icons/caret-down.svg')",
                'chevron-expand': "url('/images/icons/chevron-expand.svg')",
                'dropZonCollection': "url('/images/icons/image.svg')",
            },
            colors: {
                'bg-modal': 'rgba(0, 0, 0, 0.45)',
            },
            keyframes: {
                slideLeft: {
                    '0%': {
                        transform: 'translateX(-100%)',
                        opacity: '0',
                    },
                    '100%': {
                        transform: 'translateX(0)'
                    },
                    opacity: '1',
                },
                slideRight: {
                    '0%': {
                        transform: 'translateX(100%)',
                        opacity: '0',
                    },
                    '100%': {
                        transform: 'translateX(0)'
                    },
                    opacity: '1',
                },
            },
            animation: {
                slideLeft: 'slideLeft 0.3s ease-out',
                slideRight: 'slideRight 0.3s ease-out',
            },
        },
        backgroundPosition: {
            'right-center': 'right 15px center',
        }
    },

    plugins: [
        // require('@tailwindcss/forms')
    ],

    variants: {
        extend: {
            opacity: ['disabled'],
        },
        scrollbar: ['rounded'],
    },
};
