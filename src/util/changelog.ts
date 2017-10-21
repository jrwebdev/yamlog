import * as moment from 'moment';

import { ChangelogConfig, CurrentVersionLoader } from '../types/config';
import { VersionString } from '../types/version';
import {
  Changelog,
  ChangeType,
  Change,
  ChangelogVersion,
  ChangelogVersionMetadata,
} from '../types/changelog';

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

interface NewVersion {
  version: VersionString;
  metadata: ChangelogVersionMetadata;
  changes: ChangelogVersion;
}

const loadCurrentVersion = async (
  loaders: CurrentVersionLoader,
  releasedVersions: Changelog
) => {
  if (Array.isArray(loaders)) {
    let version;
    let i = 0;
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
  const changes = config.unreleasedDir
    ? await readUnreleasedFiles(config.unreleasedDir)
    : changelogUnreleased;

  if (changes && Object.keys(changes).length) {
    const currentVersion = await loadCurrentVersion(
      currentVersionLoader,
      released
    );

    const version = getNextVersion(changes, currentVersion, config);
    if (version) {
      const metadata = {
        date: moment().format('YYYY-MM-DD'),
      };

      await writeChangelog({
        [version]: {
          metadata,
          ...changes,
        },
        ...released,
      });

      if (config.unreleasedDir) {
        await deleteUnreleasedFiles(config.unreleasedDir);
      }

      const newVersion: NewVersion = {
        version,
        metadata,
        changes,
      };

      return newVersion;
    }
  }

  return undefined;
};
