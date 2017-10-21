import * as path from 'path';
import { writeFile, readFile } from 'fs-extra';

import { VersionString } from '../types/version';

const getFilePath = () => path.resolve('package.json');

export const read = async () => {
  const contents = await readFile(getFilePath());
  return JSON.parse(contents.toString());
};

export const readVersion = async () => {
  const packageJson = await read();
  return packageJson.version;
};

export const writeVersion = async (version: VersionString) => {
  const packageJson = await read();
  packageJson.version = version;
  return writeFile(getFilePath(), JSON.stringify(packageJson, null, 2));
};
