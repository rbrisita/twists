'use strict';

const webpackMerge = require('webpack-merge');

const commonConfig = require('./webpack.common');
const helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    mode: 'development',

    devtool: 'cheap-module-eval-source-map',

    output: {
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[id].chunk.js'
    },

    module: {
        rules: [
            /**
             * Chain the sass-loader with the css-loader (CSS to JS) and the
             * style-loader (JS to inline styles) to immediately apply all styles to the DOM.
             */
            {
                test: /\.(scss|sass)$/,
                use: [
                    { loader: 'style-loader', options: { sourceMap: true } },
                    { loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'sass-loader', options: { sourceMap: true } }
                ],
                include: helpers.root('resources', 'sass')
            },
            /**
             * Convert TypeScript to JavaScipt and require any templates found.
             */
            {
                test: /\.ts$/,
                loaders: [
                    'ts-loader',
                    'angular2-template-loader'
                ]
            }
        ]
    },

    devServer: {
        compress: true,
        index: '',
        historyApiFallback: true,
        proxy: {
            '*': 'http://localhost:8000'
        },
        stats: 'minimal'
    }
});
