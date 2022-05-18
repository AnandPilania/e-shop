const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */


mix.js('resources/js/backEnd.js', 'public/js').react()
    .postCss("resources/css/app.css", "public/css", [
        require("tailwindcss"),
        require("autoprefixer"),
    ])
    .sass('resources/sass/backend/myapp.scss', 'public/css')
    .sass('resources/sass/nav-frontend.scss', 'public/frontend/css')
    .sass('resources/sass/index-front.scss', 'public/frontend/css')
    .sass('resources/sass/productSheet.scss', 'public/frontend/css')
    .sass('resources/sass/cart.scss', 'public/frontend/css')
    .sass('resources/sass/authentification.scss', 'public/frontend/css')
    .sass('resources/sass/payment.scss', 'public/frontend/css');



