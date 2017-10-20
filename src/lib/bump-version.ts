import { ChangelogConfig, CurrentVersionLoader } from '../types/config';

import * as changelog from '../util/changelog';
import * as packageJson from '../util/package-json';
import { getCurrentVersion as getCurrentChangelogVersion } from '../util/changelog-helpers';

export default async (config: ChangelogConfig = {}) => {
  const currentVersionLoader: CurrentVersionLoader = config.currentVersionLoader || [
    getCurrentChangelogVersion,
    packageJson.readVersion,
  ];

  const newVersion = await changelog.bumpVersion(currentVersionLoader, config);
  if (newVersion) {
    await packageJson.writeVersion(newVersion);
  }

  return newVersion;
};
