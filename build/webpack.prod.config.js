const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');

const root = path.resolve(__dirname, '../');
module.exports = {
    devtool: 'none',
    mode: "production",
    performance: {
        // 只检测js文件的大小
        assetFilter: assetFilename => /\.js$/.test(assetFilename)
    },
    plugins: [
        new CleanWebpackPlugin([path.resolve(__dirname, '../docs')], {
            root: root // 设置项目根目录，根目录之外的文件会跳过删除
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        // Service Worker
        // new WorkboxPlugin.GenerateSW({
        //     clientsClaim: true,
        //     skipWaiting: true
        // })
    ]
}