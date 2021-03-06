const path = require('path')
const DllLinkPlugin = require("dll-link-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')


const DIST_DIR = 'public'
const SRC_DIR = 'src'

module.exports = {
  output: {
    publicPath: '/',
    filename: '[name]-[hash].min.js',
    path: path.resolve(__dirname, '..', DIST_DIR),
  },
  plugins: [
    new CleanWebpackPlugin([DIST_DIR]),
    new HtmlWebpackPlugin({
      template: 'src/static/index.html',
      inject: 'body',
      filename: 'index.html',
    }),
    // https://github.com/clinyong/dll-link-webpack-plugin
    new DllLinkPlugin({
      config: require('./webpack.dll'),
      htmlMode: true,
    }),
    // HTML is generated by HtmlWebpackPlugin but we might have other static
    // assets like favicon.ico. All static files should live here.
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '..', SRC_DIR, 'static'),
        to: '.'
      },
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
      "styled-components": path.resolve('./node_modules/styled-components'),
    },
    extensions: ['.js'],
    modules: [
      './node_modules',
      './src',
      './__mocks__',
    ],
  },
}
