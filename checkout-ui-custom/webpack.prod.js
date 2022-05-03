const path = require('path');
// const webpack = require('webpack');

const config = {
  // TODO: Add common Configuration
  module: {}
};

const defaultConfig = {
  ...config,
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: ['./src/checkout6-custom.js', './src/checkout6-custom.scss'],
  output: {
    filename: 'checkout6-custom.js',
    path: path.resolve(__dirname, './')
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].css'
            }
          },
          {
            loader: 'extract-loader'
          },
          {
            loader: 'css-loader?-url'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: false
            }
          }
        ]
      }
    ]
  }
};
const appConfig = {
  ...config,
  mode: 'production',
  entry: ['./src/app.checkout6-custom.js', './src/app.checkout6-custom.scss'],
  output: {
    filename: 'checkout6-custom.js',
    path: path.resolve(__dirname, '../node/templates')
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'checkout6-custom.css'
            }
          },
          {
            loader: 'extract-loader'
          },
          {
            loader: 'css-loader?-url'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: false
            }
          }
        ]
      }
    ]
  }
};

// Return Array of Configurations
module.exports = [defaultConfig, appConfig];
