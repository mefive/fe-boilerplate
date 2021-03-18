/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

exports.useMisc = true;

const contextPath = '/';

exports.contextPath = contextPath;

exports.entries = [
  {
    name: 'main',
    src: './src/Main/index',
    template: './src/templates/index.html',
  },
];

exports.webpackConfigOverrides = (config) =>
  merge(config, {
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },

    devServer: {
      historyApiFallback: {
        rewrites: [
          {
            from: '/',
            to: path.posix.join(contextPath, 'index.html'),
          },
        ],
      },
      inline: false,
      hot: false,
    },

    plugins: [
      new LodashModuleReplacementPlugin({
        cloning: true,
      }),

      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
    ],
  });
