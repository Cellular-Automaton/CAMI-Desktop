const rules = require('./webpack.rules');

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

rules.push({
  test: /\.css$/,
  use: [
    { loader: 'style-loader' }, 
    { loader: 'css-loader' },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [require("tailwindcss"), require("autoprefixer")],
        },
      },
    }
  ],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },

  plugins: [
    new NodePolyfillPlugin(),
    // Add any other plugins you need here
  ],

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
