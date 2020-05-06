const {resolve} = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.config');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    devServer: {
         contentBase: resolve(__dirname,'build'),
         compress: true
    },
    plugins: [
        new OptimizeCSSAssetsWebpackPlugin()
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
})