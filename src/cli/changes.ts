import { argv } from 'yargs';

import config from '../util/config';
import { default as changesLib, ChangesOptions } from '../lib/changes';

const run = async () => {
  // TODO: Validate args
  const transform = argv.transform || 'yaml';

  let options: ChangesOptions = { transform };

  if (argv.latest) {
    options.version = 'latest';
  } else if (argv.unreleased) {
    options.version = 'unreleased';
  } else if (argv.version) {
    options.version = argv.version;
  } else if (argv.from) {
    options.version = {
      from: argv.from,
      to: argv.to,
    };
  }

  const changes = await changesLib(options, config);
  console.log(changes);
};

run();
