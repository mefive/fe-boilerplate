/**
 * 应用上下文路径：
 * 用于设置React-Router的basename。
 * 同时也作为Webpack的publicPath默认设置。
 * 默认值为 '/'。
 */
const contextPath = '/smartair/';

/**
 * 打包入口配置：
 * 当该配置为空时，按照默认规则生成单入口打包配置。
 * 默认规则为：{ name: 'index', basePath: '/' }。
 * 如果需要配置多入口，或者不遵守默认规则的单入口，可使用此配置项实现。
 */
const entries = [

  /**
   * 复杂配置：
   */
  {

    /**
     * entry名称：
     * 必填项。
     */
    name: 'admin',

    /**
     * 入口路径：
     * 可以是字符串或字符串数组。
     * 如果不设置，默认为 `./src/app/${name}`。
     */
    src: './src/app/admin',

    /**
     * 生成HTML的文件名：
     * 如果不设置，默认为 `${name}.html`。
     * 如果设置为false，则不生成HTML文件。
     */
    html: 'admin.html',

    /**
     * 用于生成HTML文件的模板文件：
     * 如果不设置，默认为'./src/templates/index.html'。
     */
    template: './src/templates/admin.html',
  },

  /**
   * 简单配置：
   * 仅配置entry名称，等同于 { name: 'customer' }
   */
  'customer',
];

/**
 * 编译结果的输出目录：
 * 默认值为 'build'。
 * 注意：'build' 是devops.ted.sogou规定的输出目录，
 * 若要使用devops做部署，请不要改动此设置。
 */
const outputPath = 'build';

/**
 * 开发环境编译结果的输出目录：
 * 默认值为 'dev'。
 * 该目录主要用于在开发环境下预先编译dll文件(npm run dll:dev)的输出。
 * （实际的应用代码都在webpack-dev-server的内存里）
 * 与build目录分离开，是为了避免在本地测试build的时候把开发环境的dll覆盖掉。
 * 此配置项通常不需要改动。
 */
const devOutputPath = 'dev';

/**
 * 静态资源的输出目录：
 * 默认值为 'static'。
 * （在outputPath指定的目录下，即 /build/static/）
 * 静态资源包括dll，js，css，图片文件以及其他的静态资源。
 * 此配置项通常不需要改动。
 */
const staticPath = 'static';

/**
 * 是否使用misc服务地址作为publicPath：
 * 此设置仅当通过devops.ted.sogou部署时有效。
 * 开发环境统一使用contextPath作为publicPath。
 * 默认值为false。
 * TODO 增加路径规则说明
 */
const useMisc = true;

/**
 * webpack-dev-server的端口号：
 * 默认值为80。
 * 注意：此文件是项目共通设置，
 * 如果开发者要在本机环境修改此配置，
 * 请勿直接修改此配置项，
 * 而需要在local.config.js中对此配置项进行覆盖。
 */
const devServerPort = 80;

/**
 * webpack-dev-server启动后自动用浏览器打开的地址：
 * 默认值为false（不自动打开）。
 * 注意：此文件是项目共通设置，
 * 如果开发者要在本机环境修改此配置，
 * 请勿直接修改此配置项，
 * 而需要在local.config.js中对此配置项进行覆盖。
 */
const devServerOpen = false;

/**
 * webpack-dev-server的代理配置：
 * 注意：此处配置的规则并不直接沿用webpack config。
 * 如果要按照webpack config的规则配置，
 * 请使用webpackConfigOverrides配置项。
 */
const devServerProxy = [];
// const devServerProxy = [{
//   context: '/api/',
//   target: 'http://some.api.server',
// }];

const webpackConfigOverrides = {};

// TODO dll开关

module.exports = {
  contextPath,
  entries,
  outputPath,
  devOutputPath,
  staticPath,
  useMisc,
  devServerPort,
  devServerOpen,
  devServerProxy,
  webpackConfigOverrides,
};
