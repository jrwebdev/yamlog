import { compose } from 'ramda';

import { ChangelogConfig } from '../types/config';
import {
  Changelog,
  ChangelogVersion,
  ChangeType,
  Change,
  DetailedChange,
} from '../types/changelog';
import { VersionString } from '../types/version';
import { sort, isUnstable, bumpMajor, bumpMinor, bumpPatch } from './version';

const unstableBump = {
  startVersion: '0.0.1',
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

const changeTypeKeys: ChangeType[] = ['breaking', 'feature', 'fix'];
const defaultVersionKeyOrder: Array<'metadata' | ChangeType> = [
  'metadata',
  ...changeTypeKeys,
];

export const sortVersionChangeTypeEntries = (version: ChangelogVersion) =>
  defaultVersionKeyOrder.reduce(
    (acc, key) => (version[key] ? { ...acc, [key]: version[key] } : acc),
    {}
  );

const stripEmptyChangeTypes = (version: ChangelogVersion) =>
  changeTypeKeys.reduce(
    (acc, key) => {
      // TODO: Fix type
      if (acc[key] && !(acc as any)[key].length) {
        delete acc[key];
      }
      return acc;
    },
    { ...version }
  );

const flattenDetails = (change: Change) =>
  typeof change !== 'string' &&
  Object.keys(change).length === 1 &&
  change.details
    ? change.details
    : change;

const stripEmptyChangeProperties = (change: Change): Change =>
  typeof change === 'string'
    ? change
    : Object.keys(
        change
      ).reduce((acc: DetailedChange, property: keyof DetailedChange) => {
        const value = change[property];
        if (value && value.trim()) {
          acc[property] = value;
        }
        return acc;
      }, {}) as DetailedChange;

export const processChange = compose(
  flattenDetails,
  stripEmptyChangeProperties
);

export const addChangeToVersionChangeType = (
  type: ChangeType,
  change: Change,
  version: ChangelogVersion
): Change[] => [processChange(change), ...(version[type] || [])];

export const updateVersionChangeTypeEntries = (
  version: ChangelogVersion = {},
  type: ChangeType,
  updates: Change[]
): ChangelogVersion =>
  sortVersionChangeTypeEntries(
    stripEmptyChangeTypes({
      ...version,
      [type]: updates,
    })
  );

export const getCurrentVersion = (changelog: Changelog) => {
  const { unreleased, ...released } = changelog;
  const releasedVersions = released ? sort(Object.keys(released)) : [];
  return releasedVersions.length ? releasedVersions[0] : undefined;
};

export const getNextVersion = (
  unreleased: ChangelogVersion,
  currentVersion?: VersionString,
  config: ChangelogConfig = {}
) => {
  const bump =
    config.unstable && (!currentVersion || isUnstable(currentVersion))
      ? unstableBump
      : stableBump;

  if (!currentVersion) {
    return config.startVersion || bump.startVersion;
  } else if (isUnstable(currentVersion) && !config.unstable) {
    return stableBump.startVersion;
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
