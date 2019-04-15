const path = require('path');
const webpack = require('webpack');

const root = path.resolve(__dirname, '../');
module.exports = {
    devtool: 'inline-source-map',
    mode: "development",
    devServer: {
        contentBase: path.resolve(__dirname, '../docs/'),
        hot: true,
        port: 8080,
        // open browser
        open: true,
        openPage: 'index.html',
        // 只在发生错误或有新的编译时输出
        stats: 'minimal'
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // 定义环境变量 可以在源码中访问到
        // 如果访问process.env，会发现process.env是空对象
        // 要访问NODE_ENV，必须直接访问process.env.NODE_ENV
        // DefinePlugin做的工作:用"development"直接替换源码中"process.env.NODE_ENV",而不是为process.env添加"NODE_ENV"属性
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        })
    ]
}