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
    .sass('resources/sass/app.scss', 'public/css')
    .sass('resources/js/components/createProduct/createProduct_Js.scss', 'public/css')
    .sass('resources/sass/nav-frontend.scss', 'public/frontend/css')
    .sass('resources/sass/index-front.scss', 'public/frontend/css')
    .sass('resources/sass/productSheet.scss', 'public/frontend/css')
    .sass('resources/sass/cart.scss', 'public/frontend/css')
    .sass('resources/sass/authentification.scss', 'public/frontend/css')
    .sass('resources/sass/payment.scss', 'public/frontend/css')
    .sass('resources/sass/fontawesome.scss', 'public/css')
    .sass('resources/sass/back-end.scss', 'public/backend/css')
    .sass('resources/js/components/backEnd/app.scss', 'public/backend/css')
    .sass('resources/js/components/css/dropDown.scss', 'public/backend/css')
    .sass('resources/js/components/collections/collections_component.scss', 'public/backend/css')
    .sass('resources/js/components/navBar/navBar.scss', 'public/backend/css')
    .sass('resources/sass/nprogress.scss', 'public/backend/css')
    .postCss('resources/css/app.css', 'public/css', [
        require('postcss-import'),
        require('autoprefixer'),
    ]);
    