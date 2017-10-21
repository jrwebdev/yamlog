#!/usr/bin/env node
import * as path from 'path';
import { argv } from 'yargs';
import { existsSync } from 'fs-extra';

const command = argv._[0] || 'log';
const commandFile = path.resolve(__dirname, `../cli/${command}`);

if (existsSync(commandFile)) {
  require(commandFile);
} else {
  // TODO: Output help
  console.error(`${command} is not a valid yamlog command.`);
}
