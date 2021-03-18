/**
 * 合并项目公共配置和开发者本地配置，处理配置项默认值
 */
const path = require('path');

// 项目公共配置
const projectConfig = require('./project.config');
// 开发者本地配置
let localConfig;
try {
  // eslint-disable-next-line global-require
  localConfig = require('./local.config');
  // eslint-disable-next-line no-console
  console.log('local.config loaded.');
} catch (e) {
  // eslint-disable-next-line no-console
  console.log('local.config not exist.');
}

let {
  contextPath, entries,
  outputPath, devOutputPath, staticPath,
  useMisc,
  devServerPort, devServerOpen, devServerProxy,
} = { ...projectConfig, ...localConfig };

const {
  webpackConfigOverrides,
} = { ...projectConfig, ...localConfig };

if (!contextPath) {
  contextPath = '/';
} else {
  contextPath = path.posix.join('/', contextPath, '/');
}
if (!entries || entries.length === 0) {
  entries = [{ name: 'index', basePath: '/' }];
}
outputPath = outputPath || 'build';
devOutputPath = devOutputPath || 'dev';
staticPath = staticPath || 'static';
useMisc = useMisc || false;
devServerPort = devServerPort || 80;
devServerOpen = devServerOpen || false;
devServerProxy = devServerProxy || undefined;

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
