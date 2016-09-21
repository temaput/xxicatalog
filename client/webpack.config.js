const webpack = require('webpack');
const path = require('path');

const merge = require('webpack-merge');
const validate = require('webpack-validator');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pkg = require('./package.json');
const parts = require('./build/parts.js');

const PATHS = {
  app: path.resolve(__dirname, 'js', 'app.js'),
  dev: {filename: 'app.js', path: '/', publicPath: '/'},
  devServerContentBase: path.resolve(__dirname, 'public'),
  build: {filename: '[name].js', path: path.resolve(__dirname, '../nginx/public')},
  htmlTemplate: path.resolve(__dirname, 'public/index.ejs'),
}
const common = {
  entry: {app: PATHS.app},
  plugins: [
    new HtmlWebpackPlugin({
      template: PATHS.htmlTemplate,
      inject: true,
    }),
  ],
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        test: /\.js$/,
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ['url'],
      },
    ]
  },
};

const dev = {
  output: PATHS.dev,
  devtool:     'eval-source-map',
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss', 'sass'],
      },
    ],
  },
  
  devServer: {
    proxy: {
      '/graphql': 'http://localhost:8000',
      '/media': 'http://localhost:8000',
      '/static': 'http://localhost:8000',
    },
    publicPath: '/',
    stats: {colors: true},
    noInfo: true
  },
};

const build = {
  output: PATHS.build,
};

let config;

switch(process.env.npm_lifecycle_event) {
  case 'stats':
  case 'build':
    config = merge(
      common,
      build,
      /*
      parts.extractBundle({
        name: 'vendor', entries: Object.keys(pkg.dependencies)
      }),
      */
      parts.minify(),
      parts.extractStyles()
    );
    break;
  default:
    config = merge(
      common,
      dev
    )
}

module.exports = validate(config, {quiet: true});
