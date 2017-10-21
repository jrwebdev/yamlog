import { ChangelogConfig } from '../types/config';
import { Changelog, ChangelogVersion } from '../types/changelog';
import { VersionQuery } from '../types/version';

import * as changelog from '../util/changelog';
import * as yaml from '../util/yaml';
import markdownTransformer from '../util/transformers/markdown';

export interface ChangesOptions {
  transform?: 'yaml' | 'markdown' | 'json' | 'text';
  version?: VersionQuery;
}

// TODO: Move
const isChangelogVersion = (version: any): version is ChangelogVersion =>
  typeof version === 'object' &&
  (version.metadata || version.breaking || version.feature || version.fix);

// TODO: Move
const transformMarkdown = (versions: Changelog | ChangelogVersion) =>
  isChangelogVersion(versions)
    ? markdownTransformer(versions)
    : Object.keys(versions)
        .map(version => {
          const { metadata, ...changes } = versions[version];
          return markdownTransformer(changes, version, metadata);
        })
        .join('\n');

export default async (
  options: ChangesOptions = {},
  config: ChangelogConfig = {}
) => {
  const changes = await changelog.getChanges(options.version, {
    unreleasedDir: config.unreleasedDir || '',
  });

  switch (options.transform) {
    case 'yaml':
      return yaml.format(changes);
    case 'json':
      return JSON.stringify(changes, null, 2);
    case 'markdown':
      return transformMarkdown(changes);
    default:
      return changes;
  }
};
