import * as program from 'commander';

import config from '../util/config';
import { default as changesLib, ChangesOptions } from '../lib/changes';

program
  .option('-v, --version [version]', 'The version to display changes for')
  .option(
    '--from [from]',
    'The version to display a range of version change from'
  )
  .option(
    '--to [to]',
    'The version to display a range of version change to (optional, defaults to latest)'
  )
  .option('--latest', 'Display changes for the latest version')
  .option('--unreleased', 'Display unreleased changes')
  .option(
    '--format [format]',
    'Format to display changes in (yaml/json/markdown). Defaults to yaml',
    'yaml'
  )
  .parse(process.argv);

const run = async () => {
  let options: ChangesOptions = { format: program.format };

  if (program.latest) {
    options.version = 'latest';
  } else if (program.unreleased) {
    options.version = 'unreleased';
  } else if (program.version) {
    options.version = (program as any).version;
  } else if (program.from) {
    options.version = {
      from: program.from,
      to: program.to,
    };
  }

  const changes = await changesLib(options, config);
  console.log(changes);
};

run();
