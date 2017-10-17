import prompt from '../util/prompt';
import log from '../lib/log';

const run = async () => {
  const answers = await prompt();
  log(answers.type, answers.details);
  if (answers.logAnother) {
    run();
  }
};

run();
