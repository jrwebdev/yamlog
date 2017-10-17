import { existsSync } from 'fs-extra';
import { ChangeType, Change, Changelog } from '../types/changelog';
import { read as readYamlFile, write as writeYamlFile } from './yaml-file';

const changelogFile = 'changelog.yaml';

const read = async () =>
  existsSync(changelogFile)
    ? (await readYamlFile(changelogFile)) as Changelog
    : {};

const write = (changelog: Changelog) => writeYamlFile(changelogFile, changelog);

// TODO: Sort changes
export const addChange = async (changeType: ChangeType, change: Change) => {
  const { unreleased = {}, ...released } = await read();
  unreleased[changeType] = [change, ...(unreleased[changeType] || [])];
  return write({ unreleased, ...released });
};
