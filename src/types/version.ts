export type VersionType = 'major' | 'minor' | 'patch';
export type VersionString = string;

export type VersionQuery =
  | VersionString
  | { from: VersionString; to?: VersionString }
  | 'unreleased'
  | 'latest';
