import * as yargsParser from 'yargs-parser';

const { _, $0, ...gitArgs } = yargsParser(process.argv.slice(3));

export const getMessage = (args = gitArgs) => args.message || args.m;
export const noVerify = (args = gitArgs) => args.n || args.verify === false;

export const getArgStr = (args = gitArgs) =>
  Object.keys(args).reduce((acc, key) => {
    const value = args[key];
    acc += ' ';
    if (key.length === 1) {
      acc += `-${key}`;
    } else {
      acc += value === false ? `--no-` : '--';
      acc += key;
    }

    if (typeof value === 'string') {
      acc += ` "${value}"`;
    }

    return acc;
  }, '');
