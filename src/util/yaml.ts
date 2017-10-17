import * as yaml from 'js-yaml';

export const parse = (data: string): object => yaml.safeLoad(data);
export const format = (data: any): string => yaml.safeDump(data);
