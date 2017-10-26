import { Changelog } from './changelog';
import { VersionString } from './version';

type CurrentVersionLoaderFn = (
  changelog?: Changelog
) => Promise<VersionString | undefined> | VersionString | undefined;

export type CurrentVersionLoader =
  | CurrentVersionLoaderFn
  | CurrentVersionLoaderFn[];

export interface ChangelogConfig {
  unstable?: boolean;
  startVersion?: string;
  // currentVersionLoader?: CurrentVersionLoader;
}

export default interface Config extends ChangelogConfig {
  commit?: {
    cmd: string;
  };
  publish?: {
    bump?: false;
    commit?: false;
    tag?: false;
    push?: false;
    dir?: string;
    copyFiles?: string[] | false;
    pre?: string | string[];
    post?: string | string[];
  };
};
