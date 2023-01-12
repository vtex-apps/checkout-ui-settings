const path = require('path');
// const webpack = require('webpack');

const config = {
  // TODO: Add common Configuration
  module: {},
};

const defaultConfig = {
  ...config,
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: ['./src/checkout6-custom.js'],
  output: {
    filename: 'checkout6-custom.js',
    path: path.resolve(__dirname, './'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: false,
            },
          },
        ],
      },
    ],
  },
};
const appConfig = {
  ...config,
  mode: 'production',
  entry: ['./src/checkout6-custom.js'],
  output: {
    filename: 'checkout6-custom.js',
    path: path.resolve(__dirname, '../node/templates'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: false,
            },
          },
        ],
      },
    ],
  },
};

// Return Array of Configurations
module.exports = [defaultConfig, appConfig];
