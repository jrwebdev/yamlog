import * as yaml from 'js-yaml';
import * as fs from 'fs-extra';

export const parse = (data: string): object => yaml.safeLoad(data);
export const format = (data: any): string => yaml.safeDump(data);

export const readFile = async (filename: string) =>
  parse((await fs.readFile(filename)).toString());

export const writeFile = (filename: string, data: any) =>
  fs.writeFile(filename, format(data));
