const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const {resolve} = require('path');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        contentBase: resolve(__dirname,'build'),
        watchContentBase: true,
        watchOptions: {
            ignored: /node_modules/
        },
        compress: true,
        host: 'localhost',
        port:4000,
        open:true,
        progress: true,
        overlay: {errors: true},
        historyApiFallback: {
            index: '/index.html'
        }
    }
})