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

  if (userConfig.unreleasedDir) {
    config.unreleasedDir =
      userConfig.unreleasedDir === true
        ? '.yamlog-unreleased'
        : userConfig.unreleasedDir;
  }

  config.unstable = userConfig.unstable;
  config.startVersion = userConfig.startVersion;
  config.publish = userConfig.publish || {};

  return config;
};

export default getConfig();
