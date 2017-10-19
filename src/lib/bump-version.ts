import * as path from 'path';
import * as changelog from '../util/changelog';

export default async () => {
  // TODO: Get current version
  // TODO: Stable/unstable
  // TODO: Read from package json
  // TODO: Allow start version to be configured
  const currentVersion =
    (await changelog.getCurrentVersion()) ||
    require(path.resolve('package.json')).version;

  await changelog.bumpVersion(currentVersion);

  // TODO: Get next version
  // TODO: Bump
  // TODO: Remove existing change files
};
