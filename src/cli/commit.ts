import * as execa from 'execa';
import * as inquirer from 'inquirer';
import chalk from 'chalk';

import { Change } from '../types/changelog';

import { default as logPrompt } from '../util/prompt';
import { getArgStr, getMessage, noVerify } from '../util/git';

import log from '../lib/log';

const tick = chalk.bold(chalk.green('✔'));
const cross = chalk.bold(chalk.red('✘'));

const commit = () =>
  execa.shellSync(`git commit ${getArgStr()} --no-verify`, {
    stdio: 'inherit',
  });

interface LogDefaults {
  message?: string;
}

const runLog = async (defaults: LogDefaults = {}) => {
  const { type, logAnother, ...change } = await logPrompt({
    defaultMessage: defaults.message || '',
  });
  await log(type, change as Change);
  if (logAnother) {
    console.log('--------------------------');
    await runLog();
  }
};

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
    await runLog({ message: getMessage() });
    await execa('git', ['add', '.yamlog']);
  }

  commit();
};

run();
