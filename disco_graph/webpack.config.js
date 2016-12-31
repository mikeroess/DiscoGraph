var path = require("path");

module.exports = {
  context: __dirname,
  entry: "./frontend/index.js",
  output: {
   path: path.join(__dirname, 'app', 'assets', 'javascripts'),
   filename: "bundle.js"
 },
  module: {
    loaders: [
      {
        test: [/\.js?$/],
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  devtool: 'source-maps',
  resolve: {
    extensions: ["", ".js", ".jsx" ]
  }
};
