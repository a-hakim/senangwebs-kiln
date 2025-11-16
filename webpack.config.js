const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: {
      swk: './src/js/swk.js',
      style: './src/css/swk.css'
    },
    output: {
      filename: isDevelopment ? '[name].js' : '[name].min.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        name: 'SWK',
        type: 'umd',
        export: 'default',
      },
      globalObject: 'this',
      sourceMapFilename: '[file].map',
    },
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'source-map' : 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]'
          }
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isDevelopment ? '[name].css' : '[name].min.css',
      }),
      new webpack.ProvidePlugin({
        THREE: 'three'
      })
    ],
    optimization: {
      minimize: !isDevelopment,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: !isDevelopment,
            },
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'examples'),
        },
        {
          directory: path.join(__dirname, 'dist'),
          publicPath: '/dist/',
        },
      ],
      compress: true,
      port: 8080,
      open: true,
      hot: true,
    },
  };
};