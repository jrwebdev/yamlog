import * as path from 'path';
import { copy, remove, move, readFile } from 'fs-extra';

import bumpVersion from '../bump-version';

let projectDir: string;
let projectBackupDir: string;

const setupTestProject = async (name: string) => {
  projectDir = path.resolve(__dirname, 'mock-projects', name);
  projectBackupDir = path.resolve(
    __dirname,
    'mock-projects',
    `.${name}-backup`
  );
  await copy(projectDir, projectBackupDir);
};

const restoreProjectDir = async () => {
  await remove(projectDir);
  await move(projectBackupDir, projectDir);
};

const readChangelog = async () => {
  const changelog = await readFile(path.resolve(projectDir, 'changelog.yaml'));
  return changelog.toString();
};

beforeEach(() => {
  expect.hasAssertions();
});

afterEach(() => {
  restoreProjectDir();
});

it('should bump a stable version', async () => {
  await setupTestProject('stable');
  await bumpVersion();
  const changelog = await readChangelog();
  expect(changelog).toMatchSnapshot();
});

it('should bump an unstable version', async () => {
  await setupTestProject('unstable');
  await bumpVersion({ unstable: true });
  const changelog = await readChangelog();
  expect(changelog).toMatchSnapshot();
});

it('should bump to version 1 on switching config from unstable to stable', async () => {
  await setupTestProject('unstable');
  await bumpVersion();
  const changelog = await readChangelog();
  expect(changelog).toMatchSnapshot();
});
