#!/usr/bin/env node
import * as path from 'path';
import { argv } from 'yargs';
import { existsSync } from 'fs-extra';

// TODO: Use commander http://slides.com/timsanteford/conquering-commander-js
// import * as program from 'commander';

// program
//   .command('log', 'Logs a change to the changelog')
//   .command('bump-version', 'Bumps the version if there are unreleased changes')
//   .command('changes', 'Outputs changes to the console')
//   .action(env => {
//     console.log(env);
//   })
//   .parse(process.argv);

const command = argv._[0] || 'log';
const commandFile = path.resolve(__dirname, `../cli/${command}`);

if (existsSync(`${commandFile}.js`) || existsSync(`${commandFile}.ts`)) {
  require(commandFile);
} else {
  // TODO: Output help
  console.error(`${command} is not a valid yamlog command.`);
}
