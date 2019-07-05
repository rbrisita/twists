'use strict';

const webpackMerge = require('webpack-merge');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const commonConfig = require('./webpack.common');
const helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    mode: 'development',

    // Works for MiniCssExtractPlugin
    devtool: 'cheap-module-source-map',

    output: {
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[id].chunk.js'
    },

    plugins: [
        new MiniCssExtractPlugin({
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
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: true } },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: {
                                path: 'postcss.config.js'
                            }
                        }
                    },
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
    }
});
