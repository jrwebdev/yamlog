import { ChangeType, Change } from '../types/changelog';
import { addChange as addUnreleasedDirChange } from './unreleased-dir';
import { sort, bumpMajor, bumpMinor, bumpPatch } from './version';
import {
  addChange as addChangelogChange,
  read as readChangelog,
  write as writeChangelog,
} from './changelog-file';

const unstableBump = {
  startVersion: '0.1.0',
  breaking: bumpMinor,
  feature: bumpPatch,
  fix: bumpPatch,
};

const stableBump = {
  startVersion: '1.0.0',
  breaking: bumpMajor,
  feature: bumpMinor,
  fix: bumpPatch,
};

export const addChange = (
  changeType: ChangeType,
  change: Change,
  { unreleasedDir = '' } = {}
) =>
  unreleasedDir
    ? addUnreleasedDirChange(changeType, change, unreleasedDir)
    : addChangelogChange(changeType, change);

export const getCurrentVersion = async () => {
  const { unreleased, ...released } = await readChangelog();
  const releasedVersions = sort(Object.keys(released));
  return releasedVersions.length ? releasedVersions[0] : undefined;
};

export const getNextVersion = async (
  currentVersion: string,
  { unstable = false, startVersion = '0.1.0' } = {}
) => {
  // TODO: Combine into a single call
  const { unreleased = {} } = await readChangelog();

  const bump = unstable ? unstableBump : stableBump;

  if (!currentVersion) {
    return startVersion || bump.startVersion;
  } else if (unreleased.breaking && unreleased.breaking.length) {
    return bump.breaking(currentVersion);
  } else if (unreleased.feature && unreleased.feature.length) {
    return bump.feature(currentVersion);
  } else if (unreleased.fix && unreleased.fix.length) {
    return bump.fix(currentVersion);
  } else {
    return undefined;
  }
};

export const bumpVersion = async (
  currentVersion: string,
  { unstable = false, startVersion = '0.1.0' } = {}
) => {
  // TODO: Combine into a single call
  const newVersion = await getNextVersion(currentVersion, {
    unstable,
    startVersion,
  });

  if (newVersion) {
    // TODO: Read changes from change file
    const { unreleased, ...released } = await readChangelog();
    await writeChangelog({
      [newVersion]: unreleased,
      ...released,
    });
  }

  return newVersion;
};
