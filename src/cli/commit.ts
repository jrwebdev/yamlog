import { execSync } from 'child_process';
import * as inquirer from 'inquirer';
import chalk from 'chalk';

import { default as logPrompt } from '../util/prompt';
import { getArgStr, getMessage, noVerify } from '../util/git';

const tick = chalk.bold(chalk.green('✔'));
const cross = chalk.bold(chalk.red('✘'));

const commit = () =>
  execSync(`git commit ${getArgStr()} --no-verify`, {
    stdio: 'inherit',
  });

if (noVerify()) {
  commit();
  process.exit();
}

console.log(chalk.bold('\nDoes this change require a changelog entry?'));
[
  ` ${tick} New feature release`,
  ` ${tick} Fix to a released feature`,
  ` ${cross} Work-in-progress on an unreleased feature`,
  ` ${cross} Documentation`,
  ` ${cross} Internal refactoring`,
].map(m => console.log(m));

console.log();
console.log('Multiple changes should be logged separately.');
console.log();

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
        // TODO: unreleased directory
        execSync('git add changelog.yaml');
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
