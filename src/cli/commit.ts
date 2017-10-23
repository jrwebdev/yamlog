import * as execa from 'execa';
import * as inquirer from 'inquirer';
import chalk from 'chalk';

import { default as logPrompt } from '../util/prompt';
import { getArgStr, getMessage, noVerify } from '../util/git';
import config from '../util/config';

const tick = chalk.bold(chalk.green('✔'));
const cross = chalk.bold(chalk.red('✘'));

const commit = () =>
  execa.shellSync(`git commit ${getArgStr()} --no-verify`, {
    stdio: 'inherit',
  });

const run = () => {
  if (noVerify()) {
    commit();
    process.exit();
  }

  [
    '',
    chalk.bold('Does this change require a changelog entry?'),
    ` ${tick} New feature release`,
    ` ${tick} Fix to a released feature`,
    ` ${cross} Work-in-progress on an unreleased feature`,
    ` ${cross} Documentation`,
    ` ${cross} Internal refactoring`,
    '',
    'Multiple changes should be logged separately.',
    '',
  ].map(m => console.log(m));

  const prompt = inquirer.createPromptModule();
  prompt([
    {
      type: 'confirm',
      name: 'logRequired',
      message: 'Changelog entry required?',
      default: true,
    },
  ]).then(({ logRequired }) => {
    if (logRequired) {
      logPrompt({ defaultMessage: getMessage() })
        .then(() => {
          const add = config.unreleasedDir || 'changelog.yaml';
          execa.sync('git', ['add', add]);
          commit();
        })
        .catch((err: any) => {
          // TODO: Better error handling/validation
          console.log(err);
          process.exit(1);
        });
    } else {
      commit();
    }
  });
};

run();
