let mix = require('laravel-mix');
require('./webpack-custom.mix');

mix.js([
    'resources/ts/vendor.ts'
], 'public/js/vendor.js');

mix.js([
    'resources/ts/main.ts'
], 'public/js/app-component.js')
