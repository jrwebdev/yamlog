import { readFile, writeFile } from 'fs-extra';
import { parse, format } from './yaml';

export const read = async (filename: string) =>
  parse((await readFile(filename)).toString());

export const write = (filename: string, data: any) =>
  writeFile(filename, format(data));
