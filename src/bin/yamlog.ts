#!/usr/bin/env node
import { argv } from 'yargs';

const script = argv._[0] || 'log';

// TODO: Check script exists
require(`../cli/${script}`);