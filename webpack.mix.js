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

mix.js('resources/js/createProduct.js', 'public/js').react()
    .js('resources/js/editProduct.js', 'public/js').react()
    .js('resources/js/aliProductImport.js', 'public/js').react()
    .js('resources/js/backEnd.js', 'public/js').react()
    // .js('resources/js/require.js', 'public/js')
    .js('resources/js/app.js', 'public/js')
    // .js('RetrivIt/js/getProduct.js', 'public/js')
    .sass('resources/sass/backend/app.scss', 'public/css')
    .sass('resources/sass/nav-frontend.scss', 'public/frontend/css')
    .sass('resources/sass/index-front.scss', 'public/frontend/css')
    .sass('resources/sass/productSheet.scss', 'public/frontend/css')
    .sass('resources/sass/cart.scss', 'public/frontend/css')
    .sass('resources/sass/authentification.scss', 'public/frontend/css')
    .sass('resources/sass/payment.scss', 'public/frontend/css')
    .sass('resources/sass/fontawesome.scss', 'public/css')
    .postCss('resources/css/app.css', 'public/css', [
        require('postcss-import'),
        require('autoprefixer'),
    ]);
    