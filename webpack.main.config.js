
const nodeExternals = require('webpack-node-externals');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  // Put your normal webpack config below here
    // j
 externals: [nodeExternals()],

  // Resolve options for handling different file types
  resolve: {
    extensions: ['.js', '.json', '.node'],  // Ensure Webpack knows how to resolve .node files
  },
  module: {
    rules: [
      ...require('./webpack.rules'),
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
};
