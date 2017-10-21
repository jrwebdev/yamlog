import config from '../util/config';
import bumpVersion from '../lib/bump-version';

const run = async () => {
  const newVersion = await bumpVersion(config);
  if (newVersion) {
    console.log(`v${newVersion}`);
  } else {
    console.log(`no unreleased changes found`);
  }
};

run();
