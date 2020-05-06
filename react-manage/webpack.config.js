const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');
const webpack = require('webpack');
const server = require('./server/index.js');

module.exports = {
    entry: resolve(__dirname,'./src/index.js'),
    output: {
        filename: 'js/[name].[contenthash:10].js',
        path:resolve(__dirname,'build'),
        publicPath: '/',
        chunkFilename: 'js/[name]_chunk.js'
    },
    module: {
        rules: [
            // loader 处理
            // js 语法检查 在package.json 中eslintConfig --> airbnb
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: 'eslint-loader',
            //     //优先执行
            //     enforce: "pre",
            //     options: {
            //         fix: true
            //     }
            // },
            {
                oneOf: [
                            {
                                test: /\.(jsx|js)$/,
                                exclude: /node_modules/,
                                loader: 'babel-loader'
                            },
                            {
                                test: /\.less$/,
                                use: [MiniCssExtractPlugin.loader, 'css-loader',
                                    {
                                        loader: 'less-loader',
                                        options: {
                                            modifyVars: {
                                                '@primary-color': '#1DA57A',
                                            },
                                        javascriptEnabled: true,
                                        }
                                    }
                                ]
                                  
                            },
                           
                            {
                                test: /\.css$/,
                                use: [MiniCssExtractPlugin.loader,'css-loader']
                            },

                            {
                                test: /\.(jpg|png|gif)$/,
                                loader: 'url-loader',
                                options: {
                                    limit: 4*1024,
                                    name:'[hash:10].[ext]',
                                    esModule: false,
                                    outputPath:'images'
                                }
                            },
                            {
                                test: /\.html$/,
                                loader: 'html-loader',
                            },
                            {
                                exclude:/\.(html|js|css|less|jpg|png|gif)/,
                                loader:'file-loader',
                                options: {
                                    name: '[hash:10].[ext]',
                                    outputPath:'media'
                                }
                            }
                ]
            },
           
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve(__dirname,'./src/index.html')
        }),
        new MiniCssExtractPlugin({
            filename: 'css/built.[contenthash:10].css'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                server: JSON.stringify(server),
            }
        })
    ],
    performance: { 
        hints:false
    },
    resolve: {
        alias: {
            $css: resolve(__dirname,'src/css'),
            $images: resolve(__dirname,'src/images'),
            $media: resolve(__dirname, 'src/media')
        },
        extensions: ['.js','.json','.jsx','.vue'],
        modules: [resolve(__dirname, './node_modules'),'node_modules']
    }
}