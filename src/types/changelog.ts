export type ChangeType = 'breaking' | 'feature' | 'fix';
export type Change = string;

export interface ChangelogVersionMetadata {
  date: string;
}

export interface ChangelogVersion {
  metadata?: ChangelogVersionMetadata;
  breaking?: Change[];
  feature?: Change[];
  fix?: Change[];
}

export interface Changelog {
  [version: string]: ChangelogVersion;
}
