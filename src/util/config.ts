import * as path from 'path';
import * as deepFreeze from 'deep-freeze';
import { existsSync } from 'fs-extra';
import Config from '../types/config';

let config: Config;

// TODO: Validate and process config

const getConfig = () => {
  if (config) return config;

  config = {};

  const yamlogConfig = path.resolve('yamlog.config.js');
  const packageJson = path.resolve('package.json');

  if (existsSync(yamlogConfig)) {
    config = require(yamlogConfig);
  } else if (existsSync(packageJson)) {
    config = require(packageJson).yamlog;
  }

  config = { ...config };

  // TODO: Fix types
  if ((config as any).unreleasedDir === true) {
    config.unreleasedDir = '.yamlog-unreleased';
  }

  if (!config.startVersion) {
    // config.startVersion = require(packageJson).version;
  }

  return deepFreeze(config);
};

export default getConfig();
