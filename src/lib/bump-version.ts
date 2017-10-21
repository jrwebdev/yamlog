import { ChangelogConfig, CurrentVersionLoader } from '../types/config';

import * as changelog from '../util/changelog';
import * as changelogMd from '../util/changelog-md';
import * as packageJson from '../util/package-json';
import { getCurrentVersion as getCurrentChangelogVersion } from '../util/changelog-helpers';
import markdownFormatter from '../util/formatters/markdown';

export default async (config: ChangelogConfig = {}) => {
  // TODO: Allow loader to be passed in
  // TODO: Pass config into loaders
  const currentVersionLoader: CurrentVersionLoader = [
    getCurrentChangelogVersion,
    packageJson.readVersion,
  ];

  const newVersion = await changelog.bumpVersion(currentVersionLoader, config);

  if (newVersion) {
    const { version, metadata, changes } = newVersion;

    const markdown = markdownFormatter(changes, version, metadata);

    await Promise.all([
      changelogMd.prepend(markdown),
      packageJson.writeVersion(version),
    ]);

    return version;
  } else {
    return undefined;
  }
};
