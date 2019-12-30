const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')

const root = path.resolve(__dirname, '../')
module.exports = NODE_ENV => ({
  entry: {
    // polyfill: "babel-polyfill",
    graphics: path.resolve(__dirname, '../src/graphics/index.ts')
  },
  output: {
    path: path.resolve(__dirname, '../lib'),
    filename: 'index.js',
    libraryTarget: 'umd'
  },
  target: 'web',
  devtool: 'none',
  mode: 'production',
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
        test: /\.less$/,
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
          'less-loader'
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
    }
  },
  // 监听文件更改选项
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, '../lib')], {
      root: root // 设置项目根目录，根目录之外的文件会跳过删除
    }),
    new FileManagerPlugin({
      onEnd: {
        copy: [
          {
            source: path.resolve(root, 'lib/index.js'),
            destination: path.resolve(root, 'examples/lib/graphics.js')
          }
        ]
      }
    })
  ]
})
