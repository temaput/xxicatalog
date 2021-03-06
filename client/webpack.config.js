const webpack = require('webpack');
const path = require('path');

const merge = require('webpack-merge');
const validate = require('webpack-validator');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pkg = require('./package.json');
const parts = require('./build/parts.js');

const PATHS = {
  app: path.resolve(__dirname, 'js', 'app.js'),
  dev: {filename: '[name].js', path: '/', publicPath: '/'},
  devServerContentBase: path.resolve(__dirname, 'public'),
  build: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, '../nginx/public'),
    publicPath: '/'
  },
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

    // Enable history API fallback so HTML5 History API based
    // routing works. This is a good default that will come
    // in handy in more complicated setups.
    historyApiFallback: true,

    proxy: {
      '/graphql': 'http://localhost:8000',
      '/media': 'http://localhost:8000',
      '/static': 'http://localhost:8000',
    },
    publicPath: '/',
    // Display only errors to reduce the amount of output.
    stats: 'errors-only',
    //noInfo: true
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
      parts.extractStyles(),
      parts.zipAssets()
    );
    break;
  default:
    config = merge(
      common,
      dev
    )
}

module.exports = validate(config, {quiet: true});
