import * as mockFs from 'mock-fs';
import * as mockDate from 'mockdate';
import * as fs from 'fs-extra';

import { format } from '../../src/util/yaml';
import Config from '../../src/types/config';
import { Changelog, ChangeType, Change } from '../../src/types/changelog';

const createMockProject = () => {
  const setup = (
    changelog?: Changelog,
    changeFiles?: { [type in ChangeType]: Change[] },
    _config?: Config
  ) => {
    mockDate.set('2017-05-20');

    const mockFiles: any = {};
    if (changelog) {
      mockFiles['changelog.yaml'] = format(changelog);
    }

    if (changeFiles && Object.keys(changeFiles).length) {
      let i = 0;
      Object.keys(changeFiles).forEach((type: ChangeType) => {
        changeFiles[type].forEach((change: Change) => {
          mockFiles[
            `.yamlog-unreleased/${type}-${(++i)
              .toString()
              .padStart(17, '0')}.yaml`
          ] = format(change);
        });
      });
    }

    // TODO: Config
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

  return {
    setup,
    teardown,
    readChangelog,
  };
};

export default createMockProject;
