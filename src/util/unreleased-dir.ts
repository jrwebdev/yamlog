import * as moment from 'moment';
import { mkdirs } from 'fs-extra';

import { ChangeType, Change } from '../types/changelog';
import { write as writeYamlFile } from './yaml-file';
import { processChange } from './changelog-helpers';

const defaultDir = '.yamlog-unreleased';

export const addChange = async (
  type: ChangeType,
  change: Change,
  dir = defaultDir
) => {
  await mkdirs(dir);
  const filename = `${type}-${moment().format('YYYYMMDDHHmmssSSS')}.yaml`;
  return writeYamlFile(`${dir}/${filename}`, processChange(change));
};
