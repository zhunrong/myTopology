const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

const root = path.resolve(__dirname, '../')
module.exports = NODE_ENV => ({
  entry: {
    // polyfill: "babel-polyfill",
    app: path.resolve(__dirname, '../src/index.tsx')
  },
  output: {
    path: path.resolve(__dirname, '../docs'),
    // 使用[chunkhash]时,bundle文件名是对文件内容的映射,
    // 所以如果文件没有修改,名字不变,有利于客户端的缓存策略
    filename: `./static/js/[name]${
      NODE_ENV === 'production' ? '.[chunkhash]' : ''
      }.js`
  },
  target: 'web',
  resolve: {
    // 创建模块别名，在import require时使用别名会更简洁
    alias: {
      '@': path.resolve(root, 'src/')
    },
    // 当导入文件没有明确扩展名，将依次使用一下扩展名进行推测
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        // 使用import()动态加载代码时，
        // 需要安装"babel-plugin-syntax-dynamic-import"插件并配置
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.resolve(root, 'src')
      },
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        include: path.resolve(root, 'src')
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: 'global', // 开启css模块化，但是需要使用:local
              localIdentName: '[name]-[hash:base64:5]'
              // namedExport:true
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 10240,
              name: './static/images/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(ttf|woff)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './static/fonts/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  // 构建优化
  optimization: {
    // 代码分离，将重复代码分割提取到一个单独文件中
    splitChunks: {
      // chunks: 'all',
      // cacheGroups: {
      //     vendor: {
      //         test: /[\\/]node_modules[\\/]/,
      //         name: 'vendors',
      //         chunks: 'all'
      //     }
      // }
    },
    // 将webpack的运行文件提取到一个单独的文件中
    runtimeChunk: 'single'
  },
  // 监听文件更改选项
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(root, 'template.ejs'),
      filename: 'index.html',
      // favicon: path.resolve(root, 'favicon.ico'),
      cache: false
    }),
    // copy文件
    new CopyWebpackPlugin([]),
    new webpack.ProvidePlugin({
      // 'editormd': 'editor.md/editormd.min.js'
    })
  ],
  externals: {
  }
})
