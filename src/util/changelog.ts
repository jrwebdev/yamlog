import { ChangeType, Change } from '../types/changelog';
import { addChange as addChangelogChange } from './changelog-file';
import { addChange as addUnreleasedDirChange } from './unreleased-dir';

export const addChange = (
  changeType: ChangeType,
  change: Change,
  { unreleasedDir = '' } = {}
) =>
  unreleasedDir
    ? addUnreleasedDirChange(changeType, change, unreleasedDir)
    : addChangelogChange(changeType, change);
