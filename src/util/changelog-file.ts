import * as path from 'path';
import { existsSync } from 'fs-extra';
import { ChangeType, Change, Changelog } from '../types/changelog';
import { read as readYamlFile, write as writeYamlFile } from './yaml-file';

import {
  addChangeToVersionChangeType,
  updateVersionChangeTypeEntries,
} from './changelog-helpers';

const defaultChangelogFilename = 'changelog.yaml';

const getChangelogFile = () =>
  path.resolve(process.cwd(), defaultChangelogFilename);

export const read = async () => {
  const changelogFile = getChangelogFile();
  return existsSync(path.resolve(process.cwd(), changelogFile))
    ? (await readYamlFile(changelogFile)) as Changelog
    : {};
};

export const write = (changelog: Changelog) => {
  const changelogFile = getChangelogFile();
  return writeYamlFile(changelogFile, changelog);
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
