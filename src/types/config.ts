export interface ChangelogConfig {
  unstable?: boolean;
  unreleasedDir?: string;
  startVersion?: string;
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
