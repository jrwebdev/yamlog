import { Changelog, ChangelogVersion } from '../types/changelog';
import { VersionQuery } from '../types/version';

import * as changelog from '../util/changelog';
import * as yaml from '../util/yaml';
import markdownFormatter from '../util/formatters/markdown';

export interface ChangesOptions {
  format?: 'yaml' | 'markdown' | 'json' | 'text';
  version?: VersionQuery;
}

// TODO: Move
const isChangelogVersion = (version: any): version is ChangelogVersion =>
  typeof version === 'object' &&
  (version.metadata || version.breaking || version.feature || version.fix);

// TODO: Move
const formatMarkdown = (versions: Changelog | ChangelogVersion) =>
  isChangelogVersion(versions)
    ? markdownFormatter(versions)
    : Object.keys(versions)
        .map(version => {
          const { metadata, ...changes } = versions[version];
          return markdownFormatter(changes, version, metadata);
        })
        .join('\n');

export default async (options: ChangesOptions = {}) => {
  const changes = await changelog.getChanges(options.version);

  if (!changes) {
    return '';
  }

  switch (options.format) {
    case 'yaml':
      return yaml.format(changes);
    case 'json':
      return JSON.stringify(changes, null, 2);
    case 'markdown':
      return formatMarkdown(changes);
    default:
      return changes;
  }
};
