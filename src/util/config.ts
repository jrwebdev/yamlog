import * as path from 'path';
import { existsSync } from 'fs-extra';
import Config from '../types/config';

let config: Config;

const getConfig = () => {
  if (config) return config;

  let userConfig: any;

  const yamlogConfig = path.resolve('yamlog.config.js');
  const packageJson = path.resolve('package.json');

  if (existsSync(yamlogConfig)) {
    userConfig = require(yamlogConfig);
  } else if (existsSync(packageJson)) {
    userConfig = require(packageJson).yamlog;
  }

  userConfig = userConfig || {};
  config = {};

  config.unstable = userConfig.unstable;
  config.startVersion = userConfig.startVersion;
  config.log = userConfig.log || {};
  config.commit = userConfig.commit || {};
  config.publish = userConfig.publish || {};

  return config;
};

export default getConfig();
