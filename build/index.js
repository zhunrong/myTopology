const process = require('process');
const baseConfig = require('./webpack.config');
const devConfig = require('./webpack.dev.config');
const prodConfig = require('./webpack.prod.config.js');
const libConfig = require('./webpack.lib.config');
// merge()与Object.assign()的区别是：前者会合并对象属性上的数组，后者则是直接替换
const merge = require('webpack-merge');

module.exports = env => {
    switch (env.NODE_ENV) {
        case 'production':
            return merge({}, baseConfig(env.NODE_ENV), prodConfig);
        case 'development':
            return merge({}, baseConfig(env.NODE_ENV), devConfig);
        case 'lib':
            return libConfig('production');
    }
}