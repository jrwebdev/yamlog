import * as path from 'path';
import { writeFile } from 'fs-extra';

import { VersionString } from '../types/version';

const getFile = () => path.resolve('package.json');

export const read = () => require(getFile());

export const readVersion = async () => {
  const packageJson = await read();
  return packageJson.version;
};

export const writeVersion = async (version: VersionString) => {
  const packageJson = await read();
  packageJson.version = version;
  return writeFile(getFile(), JSON.stringify(packageJson, null, 2));
};
