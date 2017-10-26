import * as path from 'path';
import { existsSync, ensureFile } from 'fs-extra';
import { Changelog } from '../types/changelog';
import { read as readYamlFile, write as writeYamlFile } from './yaml-file';

const defaultChangelogFilename = '.yamlog/changelog.yaml';

export const read = async () => {
  return existsSync(path.resolve(process.cwd(), defaultChangelogFilename))
    ? (await readYamlFile(defaultChangelogFilename)) as Changelog
    : {};
};

export const write = async (changelog: Changelog) => {
  await ensureFile(defaultChangelogFilename);
  return writeYamlFile(defaultChangelogFilename, changelog);
};
