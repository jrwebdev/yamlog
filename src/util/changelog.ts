import * as moment from 'moment';

import { ChangelogConfig, CurrentVersionLoader } from '../types/config';
import { VersionString, VersionQuery } from '../types/version';
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
  read as readChangelog,
  write as writeChangelog,
} from './changelog-file';
import { sort, isInRange } from './version';

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

export const addChange = (changeType: ChangeType, change: Change) =>
  addUnreleasedDirChange(changeType, change);

export const bumpVersion = async (
  currentVersionLoader: CurrentVersionLoader,
  config: ChangelogConfig = {}
) => {
  const released = await readChangelog();
  const changes = await readUnreleasedFiles();

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

      await deleteUnreleasedFiles();

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

const getVersionRangeChanges = (
  changelog: Changelog,
  from: VersionString,
  to: VersionString
) => {
  const versions = sort(Object.keys(changelog));
  const versionRange = versions.reduce((acc: Changelog, v) => {
    if (isInRange(v, from, to)) {
      acc[v] = changelog[v];
    }
    return acc;
  }, {});
  return Object.keys(versionRange).length ? versionRange : undefined;
};

export const getUnreleasedChanges = async (_dir: string) =>
  readUnreleasedFiles();

export const getChanges = async (
  version?: VersionQuery,
  { unreleasedDir = '' } = {}
): Promise<Changelog | ChangelogVersion | undefined> => {
  if (version && version === 'unreleased') {
    return getUnreleasedChanges(unreleasedDir);
  }

  const { unreleased, ...released } = await readChangelog();
  const versions = sort(Object.keys(released));

  if (!versions.length) {
    return undefined;
  } else if (version === 'latest') {
    return { [versions[0]]: released[versions[0]] };
  } else if (typeof version === 'string') {
    return released[version] ? { [version]: released[version] } : undefined;
  } else if (typeof version === 'object') {
    const { from, to = versions[0] } = version;
    return getVersionRangeChanges(released, from, to);
  } else {
    return released;
  }
};
