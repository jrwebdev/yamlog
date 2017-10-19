import { ChangelogConfig } from '../types/config';
import { ChangeType, Change } from '../types/changelog';
import { addChange as addUnreleasedDirChange } from './unreleased-dir';
import { getCurrentVersion, getNextVersion } from './changelog-helpers';
import {
  addChange as addChangelogChange,
  read as readChangelog,
  write as writeChangelog,
} from './changelog-file';

export const addChange = (
  changeType: ChangeType,
  change: Change,
  { unreleasedDir = '' } = {}
) =>
  unreleasedDir
    ? addUnreleasedDirChange(changeType, change, unreleasedDir)
    : addChangelogChange(changeType, change);

export const bumpVersion = async (config: ChangelogConfig = {}) => {
  let newVersion;

  // TODO: Read from change files
  const { unreleased = {}, ...released } = await readChangelog();
  const currentVersion = getCurrentVersion(released);

  if (currentVersion) {
    newVersion = getNextVersion(unreleased, currentVersion, config);
    if (newVersion) {
      await writeChangelog({
        [newVersion]: unreleased,
        ...released,
      });
    }
  }

  return newVersion;
};
