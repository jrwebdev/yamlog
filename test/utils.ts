import * as path from 'path';
import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';

import Config from '../src/types/config';
import { Changelog } from '../src/types/changelog';

// TODO: Use uuid for project dir?
export const createMockProject = (dir: string) => {
  // TODO: Find way to read from memory rather than writing to disk
  const projectDir = path.resolve(__dirname, `.mock-project-${dir}`);
  const changelogFile = path.resolve(projectDir, 'changelog.yaml');

  const setup = async (
    changelog: Changelog,
    _config?: Config,
    _changeFiles?: string[]
  ) => {
    const changelogYaml = await yaml.safeDump(changelog);
    await fs.ensureDir(projectDir);
    await fs.writeFile(changelogFile, changelogYaml);
  };

  const teardown = () => {
    fs.remove(projectDir);
  };

  const readChangelog = async () => {
    const contents = await fs.readFile(changelogFile);
    return contents.toString();
  };

  return {
    setup,
    teardown,
    readChangelog,
  };
};
