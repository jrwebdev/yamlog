import { compose } from 'ramda';

import { VersionType, VersionString } from '../types/version';

export type VersionObject = { [type in VersionType]: number };
export type Version = VersionString | VersionObject;

const versionRegex = new RegExp('^([0-9]+).([0-9]+).([0-9]+)');

const isVersionObject = (version: any): version is VersionObject =>
  typeof version === 'object' &&
  typeof version.major === 'number' &&
  typeof version.minor === 'number' &&
  typeof version.patch === 'number';

const parse = (version: VersionString): VersionObject | undefined => {
  const match = version.match(versionRegex);
  if (!match) {
    return undefined;
  } else {
    const [major, minor, patch] = match.slice(1, 4).map(v => parseInt(v, 10));
    return { major, minor, patch };
  }
};

const format = (version: VersionObject): VersionString =>
  `${version.major}.${version.minor}.${version.patch}`;

export const isUnstable = (version: VersionString) => {
  const parsed = parse(version);
  return parsed ? parsed.major === 0 : undefined;
};

const zero = (type: VersionType) => (version?: VersionObject) => {
  if (isVersionObject(version)) {
    return { ...version, [type]: 0 };
  } else {
    return undefined;
  }
};

const increase = (type: VersionType) => (version?: VersionObject) => {
  // TODO: Reduce duplication
  if (isVersionObject(version)) {
    return { ...version, [type]: version[type] + 1 };
  } else {
    return undefined;
  }
};

export const isVersionString = (version: any): version is VersionString =>
  typeof version === 'string' && versionRegex.test(version);

export const sort = (versions: VersionString[]): VersionString[] =>
  [...versions]
    .map(parse)
    .filter(isVersionObject)
    .sort((a, b) => {
      if (a.major !== b.major) {
        return a.major > b.major ? -1 : 1;
      } else if (a.minor !== b.minor) {
        return a.minor > b.minor ? -1 : 1;
      } else {
        return a.patch > b.patch ? -1 : 1;
      }
    })
    .map(format);

export const bumpMajor = compose(
  format,
  increase('major'),
  zero('minor'),
  zero('patch'),
  parse
);

export const bumpMinor = compose(
  format,
  increase('minor'),
  zero('patch'),
  parse
);

export const bumpPatch = compose(format, increase('patch'), parse);