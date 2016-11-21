var webpack = require('webpack');

module.exports = {
  entry: {
    html: __dirname+'/index.html',
    main: __dirname+'/main.js',
  },
  output: {
    path: __dirname+'/build',
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
        },
      }, {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
    ],
  },
  plugins: process.argv.indexOf('--release')>=0 ? [
    // https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ] : [],
  devtool: 'source-map',
}
