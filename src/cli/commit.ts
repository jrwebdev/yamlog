import * as execa from 'execa';
import * as inquirer from 'inquirer';
import chalk from 'chalk';

import { default as logPrompt } from '../util/prompt';
import { getArgStr, getMessage, noVerify } from '../util/git';
import config from '../util/config';

import log from '../lib/log';

const tick = chalk.bold(chalk.green('✔'));
const cross = chalk.bold(chalk.red('✘'));

const commit = () =>
  execa.shellSync(`git commit ${getArgStr()} --no-verify`, {
    stdio: 'inherit',
  });

const run = async () => {
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
  const { logRequired } = await prompt([
    {
      type: 'confirm',
      name: 'logRequired',
      message: 'Changelog entry required?',
      default: true,
    },
  ]);

  if (logRequired) {
    const answers = await logPrompt({ defaultMessage: getMessage() });
    await log(answers.type, answers.details);

    const add = config.unreleasedDir || 'changelog.yaml';
    await execa('git', ['add', add]);
  }

  commit();
};

run();
