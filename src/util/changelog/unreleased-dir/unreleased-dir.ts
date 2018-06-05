import * as moment from 'moment';
// import * as cbGlob from 'glob';
// import * as pify from 'pify';
import { mkdirs /* remove */ } from 'fs-extra';

import * as yaml from '../../yaml/';

const defaultDir = '.yamlog/unreleased';

export const addChange = async (filename: string, change: any) => {
  await mkdirs(defaultDir);
  const timestamp = moment().format('YYYYMMDDHHmmssSSS');
  return yaml.writeFile(
    `${defaultDir}/${`${filename}-${timestamp}.yaml`}`,
    change
  );
};
