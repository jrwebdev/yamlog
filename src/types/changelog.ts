export type ChangeType = 'breaking' | 'feature' | 'fix';
export type Change = string;

export interface ChangelogVersionMetadata {
  date: string;
}

type ChangelogVersionChanges = { [type in ChangeType]?: Change[] };

// interface ChangelogVersionChanges {
//   breaking?: Change[];
//   feature?: Change[];
//   fix?: Change[];
// }

export interface ChangelogVersion extends ChangelogVersionChanges {
  metadata?: ChangelogVersionMetadata;
}

export interface Changelog {
  [version: string]: ChangelogVersion;
}
