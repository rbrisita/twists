let mix = require('laravel-mix');
require('./webpack-custom.mix');

mix.js([
    'resources/ts/vendor.ts',
    'resources/js/foundation.js',
], 'public/js/vendor.js');

mix.js([
    'resources/ts/main.ts',
], 'public/js/app.js');

mix.sass('resources/sass/app.scss', 'public/css/app.css');
