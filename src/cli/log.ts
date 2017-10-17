import prompt from '../util/prompt';
import log from '../lib/log';

log('breaking', 'test change 123');

const run = async () => {
  const answers = await prompt();
  log(answers.type, answers.details);
  if (answers.logAnother) {
    run();
  }
};

run();
