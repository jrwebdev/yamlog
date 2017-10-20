import * as mockFs from 'mock-fs';
import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';

import Config from '../src/types/config';
import { Changelog } from '../src/types/changelog';

export const getMock = <T>(fn: (...args: any[]) => T) => fn as jest.Mock<T>;

// TODO: Use uuid for project dir?
export const createMockProject = () => {
  const setup = async (
    changelog: Changelog,
    _config?: Config,
    _changeFiles?: string[]
  ) => {
    // TODO: no changelog.yaml
    // TODO: Config
    // TODO: Changelog
    mockFs({
      'changelog.yaml': yaml.safeDump(changelog),
    });
  };

  const teardown = () => {
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
