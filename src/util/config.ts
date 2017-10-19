import * as path from 'path';
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

  if ((config as any).unreleasedDir === true) {
    config.unreleasedDir = '.yamlog-unreleased';
  }

  if (!config.startVersion) {
    // TODO: Combine with config load from package.json
    // TODO: Singleton module which yamlog-git-commit can
    //       pass config into.
    // TODO: Set default to 0.1.0 / 1.0.0 based on stable/unstable
    config.startVersion = require(packageJson).version;
  }

  return config;
};

export default getConfig();
