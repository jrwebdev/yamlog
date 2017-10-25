import config from '../util/config';
import prompt from '../util/prompt';

import { Change } from '../types/changelog';

import log from '../lib/log';

const run = async () => {
  const { type, logAnother, ...change } = await prompt();
  log(type, change as Change, config);
  if (logAnother) {
    run();
  }
};

run();
