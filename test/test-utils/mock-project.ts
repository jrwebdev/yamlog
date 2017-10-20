import * as mockFs from 'mock-fs';
import * as mockDate from 'mockdate';
import * as fs from 'fs-extra';

import { format } from '../../src/util/yaml';
import Config from '../../src/types/config';
import { Changelog } from '../../src/types/changelog';

const createMockProject = () => {
  const setup = (
    changelog?: Changelog,
    _config?: Config,
    _changeFiles?: string[]
  ) => {
    mockDate.set('2017-05-20');

    const mockFiles: any = {};
    if (changelog) {
      mockFiles['changelog.yaml'] = format(changelog);
    }

    // TODO: Config
    // TODO: Change files
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
