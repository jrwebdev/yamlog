import * as moment from 'moment';

import { ChangelogConfig } from '../types/config';
import { ChangeType, Change } from '../types/changelog';
import {
  addChange as addUnreleasedDirChange,
  read as readUnreleasedFiles,
  deleteFiles as deleteUnreleasedFiles,
} from './unreleased-dir';
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
  const {
    unreleased: changelogUnreleased,
    ...released,
  } = await readChangelog();

  // TODO: Combine?
  const unreleased = config.unreleasedDir
    ? await readUnreleasedFiles(config.unreleasedDir)
    : changelogUnreleased;

  if (Object.keys(unreleased).length) {
    const currentVersion = getCurrentVersion(released);
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
    }
  }

  return undefined;
};
