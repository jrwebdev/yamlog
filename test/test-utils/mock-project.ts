import * as mockFs from 'mock-fs';
import * as mockDate from 'mockdate';
import * as cbGlob from 'glob';
import * as pify from 'pify';
import * as fs from 'fs-extra';

import { format } from '../../src/util/yaml';
import Config from '../../src/types/config';
import { Changelog, ChangeType, Change } from '../../src/types/changelog';

const glob = pify(cbGlob);

const fileTimestamp = (fileNumber: string) =>
  '0'.repeat(17 - fileNumber.length) + fileNumber;

const createMockProject = () => {
  const setup = (
    changelog?: Changelog,
    changeFiles?: { [type in ChangeType]: Change[] },
    mockFiles: { [filename: string]: any } = {}
  ) => {
    mockDate.set('2017-05-20 14:00');

    if (changelog) {
      mockFiles['changelog.yaml'] = format(changelog);
    }

    if (changeFiles && Object.keys(changeFiles).length) {
      let i = 0;
      Object.keys(changeFiles).forEach((type: ChangeType) => {
        changeFiles[type].forEach((change: Change) => {
          const filename = `.yamlog/unreleased/${type}-${fileTimestamp(
            (i++).toString()
          )}.yaml`;

          mockFiles[filename] = format(change);
        });
      });
    }

    mockFiles['package.json'] =
      mockFiles['package.json'] ||
      JSON.stringify({
        version: '0.0.0',
      });

    mockFs(mockFiles);
  };

  const teardown = () => {
    mockDate.reset();
    mockFs.restore();
  };

  const readChangelog = async () => {
    const contents = await fs.readFile('changelog.yaml');
    return contents.toString();
  };

  const readChangeFile = async () => {
    const changeFiles = await glob('.yamlog/unreleased/*.*');
    const contents = await fs.readFile(changeFiles[0]);
    return {
      filename: changeFiles[0],
      contents: contents.toString(),
    };
  };

  const readPackageJson = async () => {
    const contents = await fs.readFile('package.json');
    return JSON.parse(contents.toString());
  };

  return {
    setup,
    teardown,
    readChangelog,
    readChangeFile,
    readPackageJson,
  };
};

export default createMockProject;
