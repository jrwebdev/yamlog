import config from '../util/config';
import bumpVersion from '../lib/bump-version';

const run = async () => {
  await bumpVersion(config);
};

run();
