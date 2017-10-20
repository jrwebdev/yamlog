import { ChangelogConfig } from '../types/config';
import * as changelog from '../util/changelog';
import * as packageJson from '../util/package-json';

export default async (config: ChangelogConfig = {}) => {
  const newVersion = await changelog.bumpVersion(config);
  if (newVersion) {
    packageJson.writeVersion(newVersion);
  }
};
