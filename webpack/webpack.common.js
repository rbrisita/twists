'use strict';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const helpers = require('./helpers');
const is_dev = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: {
        polyfills: helpers.root('resources', 'ts', 'polyfills.ts'),
        foundation: helpers.root('resources', 'js', 'foundation.js'),
        vendor: helpers.root('resources', 'ts', 'vendor.ts'),
        main: is_dev ? helpers.root('resources', 'ts', 'main.ts') : helpers.root('resources', 'ts', 'main.aot.ts')
    },

    output: {
        path: helpers.root('public'),
        publicPath: ''
    },

    optimization: {
        noEmitOnErrors: true
    },

    resolve: {
        extensions: ['.ts', '.js', '.scss', '.css']
    },

    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                helpers.root('public', 'css', '*'),
                helpers.root('public', 'js', '*')
            ],
            verbose: true
        }),

        // For more template examples:
        // https://github.com/jaketrent/html-webpack-template/blob/86f285d5c790a6c15263f5cc50fd666d51f974fd/index.html
        new HtmlWebpackPlugin({
            filename: helpers.root('resources', 'views', 'app.blade.php'),
            inject: false,
            template: helpers.root('resources', 'views', 'template.blade.php')
        })
    ],

    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            /**
             * Find Angular Component styles and convert them to strings.
             */
            {
                test: /\.(scss|sass)$/,
                use: [
                    'to-string-loader',
                    { loader: 'css-loader', options: { sourceMap: is_dev } },
                    { loader: 'sass-loader', options: { sourceMap: is_dev } }
                ],
                include: helpers.root('resources', 'ts')
            }
        ]
    }
};
