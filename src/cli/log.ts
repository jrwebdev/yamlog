import prompt from '../util/prompt';

import { Change } from '../types/changelog';

import log from '../lib/log';

const run = async () => {
  const { type, logAnother, ...change } = await prompt();
  log(type, change as Change);
  if (logAnother) {
    run();
  }
};

run();
