import * as moment from 'moment';

import { ChangelogConfig, CurrentVersionLoader } from '../types/config';
import { Changelog, ChangeType, Change } from '../types/changelog';

import {
  addChange as addUnreleasedDirChange,
  read as readUnreleasedFiles,
  removeDir as deleteUnreleasedFiles,
} from './unreleased-dir';
import { getNextVersion } from './changelog-helpers';
import {
  addChange as addChangelogChange,
  read as readChangelog,
  write as writeChangelog,
} from './changelog-file';

const loadCurrentVersion = async (
  loaders: CurrentVersionLoader,
  releasedVersions: Changelog
) => {
  if (Array.isArray(loaders)) {
    let version;
    let i = 0;
    // TODO: Change to use recursion
    while (!version && loaders[i]) {
      version = await loaders[i](releasedVersions);
      i += 1;
    }
    return version;
  } else {
    return await loaders(releasedVersions);
  }
};

export const addChange = (
  changeType: ChangeType,
  change: Change,
  { unreleasedDir = '' } = {}
) =>
  unreleasedDir
    ? addUnreleasedDirChange(changeType, change, unreleasedDir)
    : addChangelogChange(changeType, change);

export const bumpVersion = async (
  currentVersionLoader: CurrentVersionLoader,
  config: ChangelogConfig = {}
) => {
  const {
    unreleased: changelogUnreleased,
    ...released,
  } = await readChangelog();

  // TODO: Combine?
  const unreleased = config.unreleasedDir
    ? await readUnreleasedFiles(config.unreleasedDir)
    : changelogUnreleased;

  if (unreleased && Object.keys(unreleased).length) {
    const currentVersion = await loadCurrentVersion(
      currentVersionLoader,
      released
    );

    const newVersion = getNextVersion(unreleased, currentVersion, config);
    if (newVersion) {
      await writeChangelog({
        [newVersion]: {
          metadata: {
            date: moment().format('YYYY-MM-DD'),
          },
          ...unreleased,
        },
        ...released,
      });

      if (config.unreleasedDir) {
        await deleteUnreleasedFiles(config.unreleasedDir);
      }

      return newVersion;
    }
  }

  return undefined;
};
