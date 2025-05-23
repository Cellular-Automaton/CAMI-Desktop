
const nodeExternals = require('webpack-node-externals');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const plugin = require('@tailwindcss/forms');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  // Put your normal webpack config below here
  // j
  // externals: [
  //   nodeExternals()
  // ],

  plugins: [
    new NodePolyfillPlugin()
    // Add any other plugins you need here
  ],
  
  // Resolve options for handling different file types
  resolve: {
    extensions: ['.js', '.json', '.node', '.mjs'],  // Ensure Webpack knows how to resolve .node files
  },

  module: {
    rules: [
      ...require('./webpack.rules'),
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
};
