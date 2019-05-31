'use strict';

const webpackMerge = require('webpack-merge');

const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const commonConfig = require('./webpack.common');
const helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    mode: 'development',

    // cheap-module-source-map ony works for MiniCSSExtractPlugin
    devtool: 'cheap-module-source-map',

    output: {
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[id].chunk.js'
    },

    plugins: [
        new MiniCSSExtractPlugin({
            filename: 'css/app.[hash].css'
        })
    ],

    module: {
        rules: [
            /**
             * Chain the sass-loader with the css-loader (CSS to JS) and
             * extract into file.
             */
            {
                test: /\.(scss|sass)$/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'sass-loader', options: { sourceMap: true } }
                ],
                include: helpers.root('resources', 'sass')
            },
            {
                test: /\.ts$/,
                loaders: [
                    'ts-loader',
                    'angular2-template-loader'
                ]
            },
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
