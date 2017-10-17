import config from '../util/config';
import prompt from '../util/prompt';

import log from '../lib/log';

const run = async () => {
  const answers = await prompt();
  log(answers.type, answers.details, config);
  if (answers.logAnother) {
    run();
  }
};

run();
