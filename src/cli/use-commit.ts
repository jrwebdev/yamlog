import chalk from 'chalk';
import config from '../util/config';

const run = () => {
  // TODO: Find a more robust way of checking if using git hook
  // TODO: Output GIT_PARAMS in message
  if (process.env.hasOwnProperty('GIT_PARAMS')) {
    // TODO: Check for yarn.lock
    // TODO: Message for yamlog-git-commit
    const cmd =
      (config.commit && config.commit.cmd) || `yarn run yamlog commit`;
    console.log(`\n\nUse ${chalk.bold(cmd)} to commit changes\n\n`);
    process.exit(1);
  }
};

run();
