import * as moment from 'moment';
import * as cbGlob from 'glob';
import * as pify from 'pify';
import { mkdirs, remove } from 'fs-extra';

import { ChangeType, Change, ChangelogVersion } from '../types/changelog';
import { write as writeYamlFile, read as readYamlFile } from './yaml-file';
import {
  processChange,
  sortVersionChangeTypeEntries,
} from './changelog-helpers';

const defaultDir = '.yamlog/unreleased';

const glob = pify(cbGlob);

const getType = (filename: string) => {
  const match = filename.match(/(breaking|feature|fix)-[0-9]{17}\.yaml/);
  return match ? match[1] as ChangeType : undefined;
};

export const addChange = async (type: ChangeType, change: Change) => {
  await mkdirs(defaultDir);
  const filename = `${type}-${moment().format('YYYYMMDDHHmmssSSS')}.yaml`;
  return writeYamlFile(`${defaultDir}/${filename}`, processChange(change));
};

export const removeDir = () => remove(defaultDir);

export const read = async (): Promise<ChangelogVersion> => {
  // TODO: Normalise dir path
  const files: string[] = await glob(
    `${defaultDir}/+(breaking|feature|fix)-*.yaml`
  );
  if (files && files.length) {
    const reads = files.map(async file => {
      const type = getType(file);
      const change = (await readYamlFile(file)) as Change;
      return { type, change };
    });

    const changeArr = await Promise.all(reads);

    const changes = changeArr.reduce(
      (acc: ChangelogVersion, { type, change }) => {
        if (type) {
          acc[type] = [...(acc[type] || []), change];
        }
        return acc;
      },
      {}
    );

    return sortVersionChangeTypeEntries(changes);
  } else {
    return {};
  }
};
