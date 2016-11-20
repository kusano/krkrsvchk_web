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
  devtool: 'source-map',
}
