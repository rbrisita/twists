let mix = require('laravel-mix');
let path = require('path');
let webpack = require('webpack');

mix.webpackConfig({
    resolve: {
        extensions: ['.ts']
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: [
                    'ts-loader',
                    'angular2-template-loader',
                ]
            }
        ]
    },

    plugins: [
        new webpack.ContextReplacementPlugin(
            /\@angular(\\|\/)core(\\|\/)fesm5/,
            path.join(__dirname, './src')
        )
    ]
});
