'use strict';

const webpackMerge = require('webpack-merge');

const ngw = require('@ngtools/webpack');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const commonConfig = require('./webpack.common');
const helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    mode: 'production',

    output: {
        filename: 'js/[hash].js',
        chunkFilename: 'js/[id].[hash].chunk.js'
    },

    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: 'single',
        minimizer: [
            new OptimizeCSSAssetsPlugin(),
            new TerserPlugin()
        ]
    },

    plugins: [
        new MiniCSSExtractPlugin({
            filename: 'css/app.[hash].css'
        }),
        new ngw.AngularCompilerPlugin({
            tsConfigPath: helpers.root('tsconfig.aot.json'),
            entryModule: helpers.root('resources', 'ts', 'app.module#AppModule')
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
                    'css-loader',
                    'sass-loader'
                ],
                include: helpers.root('resources', 'sass')
            },
            /**
             * Create AppModuleNgFactory entry module.
             */
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                loader: '@ngtools/webpack'
            }
        ]
    }
});
