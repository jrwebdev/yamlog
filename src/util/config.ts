import * as path from 'path';
import { existsSync } from 'fs-extra';
import Config from '../types/config';

let config: Config;

// TODO: Validate and process config

const getConfig = () => {
  if (config) return config;

  const yamlogConfig = path.resolve('yamlog.config.js');
  const packageJson = path.resolve('package.json');
  if (existsSync(yamlogConfig)) {
    config = require(yamlogConfig);
  } else if (existsSync(packageJson)) {
    config = require(packageJson).yamlog;
  }

  return config || {};
};

export default getConfig();
