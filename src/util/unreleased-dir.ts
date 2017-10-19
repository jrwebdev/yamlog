import * as moment from 'moment';
import * as cbGlob from 'glob';
import * as pify from 'pify';
import { mkdirs } from 'fs-extra';

import { ChangeType, Change, ChangelogVersion } from '../types/changelog';
import { write as writeYamlFile, read as readYamlFile } from './yaml-file';
import { processChange } from './changelog-helpers';

const defaultDir = '.yamlog-unreleased';

const glob = pify(cbGlob);

const getType = (filename: string) => {
  const match = filename.match(/(breaking|feature|fix)-[0-9]{17}\.yaml/);
  return match ? match[1] as ChangeType : undefined;
};

export const addChange = async (
  type: ChangeType,
  change: Change,
  dir = defaultDir
) => {
  await mkdirs(dir);
  const filename = `${type}-${moment().format('YYYYMMDDHHmmssSSS')}.yaml`;
  return writeYamlFile(`${dir}/${filename}`, processChange(change));
};

export const read = async (_dir = defaultDir) => {
  const changes: ChangelogVersion = {};
  const files: string[] = await glob('+(breaking|feature|fix)-*.yaml');
  if (files && files.length) {
    files.forEach(async file => {
      const type = getType(file);
      if (type) {
        const change = (await readYamlFile(file)) as Change;
        // TODO: Clean up ordering etc.
        changes[type] = [...(changes[type] || []), change];
      }
    });
  }

  return changes;
};
