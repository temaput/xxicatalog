var path = require('path')
module.exports = {
  entry: path.resolve(__dirname, 'js', 'app.js'),
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        test: /\.js$/,
      },
      { test: /\.css$/, loader: 'style!css' },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss', 'sass'],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ['url'],
      },
    ]
  },
  output: {filename: '/app.js', path: '/', publicPath: '/js/'},
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    proxy: {
      '/graphql': 'http://localhost:8000',
      '/media': 'http://localhost:8000',
      '/static': 'http://localhost:8000',
    },
    publicPath: '/js/',
    stats: {colors: true},
    noInfo: true
  }
}
