export type ChangeType = 'breaking' | 'feature' | 'fix';

export interface DetailedChange {
  details: string;
  module?: string;
}

export type Change = string | DetailedChange;

export interface ChangelogVersionMetadata {
  date: string;
}

type ChangelogVersionChanges = { [type in ChangeType]?: Change[] };

export interface ChangelogVersion extends ChangelogVersionChanges {
  metadata?: ChangelogVersionMetadata;
}

export interface Changelog {
  [version: string]: ChangelogVersion;
}
