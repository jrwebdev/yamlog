import * as path from 'path';
import { existsSync, ensureFile } from 'fs-extra';
import { ChangeType, Change, Changelog } from '../types/changelog';
import { read as readYamlFile, write as writeYamlFile } from './yaml-file';

import {
  addChangeToVersionChangeType,
  updateVersionChangeTypeEntries,
} from './changelog-helpers';

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

export const addChange = async (type: ChangeType, change: Change) => {
  const { unreleased = {}, ...released } = await read();

  const updatedVersionChangeTypes = addChangeToVersionChangeType(
    type,
    change,
    unreleased
  );

  const updatedUnreleased = updateVersionChangeTypeEntries(
    unreleased,
    type,
    updatedVersionChangeTypes
  );

  return write({ unreleased: updatedUnreleased, ...released });
};
