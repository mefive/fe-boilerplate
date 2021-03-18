/* eslint @typescript-eslint/no-var-requires: "off" */
const _ = require('lodash');
const express = require('express');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pkg = require('./package.json');

const {
  contextPath,
  entries,
  outputPath,
  devOutputPath,
  staticPath,
  useMisc,
  devServerPort,
  devServerProxy,
  webpackConfigOverrides,
} = require('./config/merged.config.js');

module.exports = function webpackConfig(env, argv) {
  // 在devops.ted.sogou部署环境下会注入package和version环境变量，根据此环境变量生成misc服务的publicPath。
  const packageName = process.env.package && process.env.package.trim();
  const version = process.env.version && process.env.version.trim();
  console.log('packageName:', packageName);
  console.log('version:', version);
  const { buildTarget = 'app' } = env || {};
  const { mode = 'development' } = argv || {};
  const isDev = mode === 'development';

  let publicPath;
  if (!isDev && useMisc && packageName && version) {
    publicPath = `https://misc.sogou-inc.com/app/${packageName}/${version}/`;
  } else {
    publicPath = contextPath;
  }

  const buildRootPath = path.join(
    __dirname,
    isDev ? devOutputPath : outputPath,
  );

  console.log('buildRootPath:', buildRootPath);

  // const buildStaticPath = path.join(buildRootPath, staticPath);
  const buildDllPath = path.join(buildRootPath, 'dll');

  if (buildTarget === 'dll') {
    return {
      entry: {
        polyfill: ['core-js/stable', 'regenerator-runtime/runtime'],
        vendor: ['moment', 'axios'],
        react: [
          'react',
          'react-dom',
          'prop-types',
          'react-router-dom',
          'mobx',
          'mobx-react',
        ],
      },
      output: {
        filename: 'dll/[name].[chunkhash].dll.js',
        path: buildRootPath,
        library: '[name]_lib',
      },
      plugins: [
        new CleanWebpackPlugin(),
        new webpack.DllPlugin({
          path: path.join(buildDllPath, '[name]-manifest.json'),
          name: '[name]_lib',
        }),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
      ],
    };
  }

  // 多入口的entry、HtmlWebpackPlugin、devServer.historyApiFallback的配置
  const entry = {};
  const htmlPlugins = [];
  const rewrites = [];
  entries.forEach((item) => {
    let name;
    let src;
    let html;
    let template;
    let basePath;
    if (typeof item === 'string') {
      name = item;
    } else {
      ({ name, src, html, template, basePath } = item);
    }
    if (!src) {
      src = `./src/app/${name}`;
    }
    if (!html && html !== false) {
      html = `${name}.html`;
    }
    if (!template) {
      template = './src/templates/index.html';
    }
    if (!basePath) {
      basePath = name;
    }
    entry[name] = src;

    if (html !== false) {
      htmlPlugins.push(
        new HtmlWebpackPlugin({
          template,
          publicPath,
          filename: html,
          chunks: [name],
        }),
      );
      rewrites.push({
        from: new RegExp(`^${path.posix.join(contextPath, basePath)}`),
        to: path.posix.join(contextPath, html),
      });
    }
  });

  const proxy =
    devServerProxy &&
    devServerProxy.map(({ context, target }) => ({
      context,
      target,
      secure: false,
      changeOrigin: true,
      xfwd: true,
      cookieDomainRewrite: {
        '*': '',
      },
    }));

  const config = {
    entry,

    output: {
      filename: path.posix.join(
        staticPath,
        'js',
        `[name]${isDev ? '' : '.[hash:7]'}.js`,
      ),
      chunkFilename: path.posix.join(
        staticPath,
        'js',
        '[name].[chunkhash:7].chunk.js',
      ),
      path: buildRootPath,
      publicPath,
      library: `${pkg.name}-[name]`,
      libraryTarget: 'umd',
    },

    module: {
      rules: [
        {
          test: /\.([jt])sx?$/,
          exclude: [/node_modules/],
          use: 'babel-loader',
        },
        {
          test: /\.less$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 100,
                name: '[name].[hash:7].[ext]',
                outputPath: path.join(staticPath, 'images'),
                publicPath: publicPath + path.posix.join(staticPath, 'images'),
              },
            },
          ],
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: '[name].[hash:7].[ext]',
                outputPath: path.join(staticPath, 'fonts'),
                publicPath: publicPath + path.posix.join(staticPath, 'fonts'),
              },
            },
          ],
        },
        {
          test: /\.(rar|jar|zip|pdf|md)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1,
                name: '[name].[hash:7].[ext]',
                outputPath: path.join(staticPath, 'files'),
                publicPath: publicPath + path.posix.join(staticPath, 'files'),
              },
            },
          ],
        },
      ],
    },

    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    plugins: _.concat(
      new webpack.EnvironmentPlugin({
        NODE_ENV: mode,
        version: version || 'development',
      }),

      new webpack.DefinePlugin({
        webpackConfig: JSON.stringify({ publicPath, contextPath }),
      }),

      new MiniCssExtractPlugin({
        filename: `${staticPath}/css/[name].[hash:7].css`,
        chunkFilename: `${staticPath}/css/[id].css`,
      }),

      htmlPlugins,

      new CleanWebpackPlugin(),
    ),

    devtool: mode === 'development' ? 'source-map' : false,

    devServer: {
      host: '0.0.0.0',
      disableHostCheck: true,
      port: devServerPort,
      inline: true,
      hot: true,
      open: false,
      compress: true,
      // contentBase: buildRootPath,
      publicPath,
      before(app) {
        app.use(contextPath, express.static(buildRootPath));
      },
      historyApiFallback: {
        rewrites,
      },
      proxy,
    },
  };

  if (webpackConfigOverrides) {
    return webpackConfigOverrides(config);
  }

  return config;
};
