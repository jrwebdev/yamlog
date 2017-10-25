import config from '../util/config';
import prompt from '../util/prompt';

import log from '../lib/log';

const run = async () => {
  const { type, details, module, logAnother } = await prompt();
  log(type, { details, module }, config);
  if (logAnother) {
    run();
  }
};

run();
