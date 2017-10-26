import { createMockProject } from './test-utils';

import log from '../src/lib/log';

let mockProject: any;

beforeEach(() => {
  mockProject = createMockProject();
});

afterEach(() => {
  mockProject.teardown();
});

it('should write a file for a fix', async () => {
  mockProject.setup();
  await log('fix', 'Fix 1');
  const changeFile = await mockProject.readChangeFile();
  mockProject.teardown();
  expect(changeFile.filename).toEqual(
    '.yamlog/unreleased/fix-20170520140000000.yaml'
  );
  expect(changeFile.contents).toMatchSnapshot();
});

it('should write a file for a feature', async () => {
  mockProject.setup();
  await log('feature', 'Feature 2');
  const changeFile = await mockProject.readChangeFile();
  mockProject.teardown();
  expect(changeFile.filename).toEqual(
    '.yamlog/unreleased/feature-20170520140000000.yaml'
  );
  expect(changeFile.contents).toMatchSnapshot();
});

it('should write a file for a breaking change', async () => {
  mockProject.setup();
  await log('breaking', 'Breaking Change 1');
  const changeFile = await mockProject.readChangeFile();
  mockProject.teardown();
  expect(changeFile.filename).toEqual(
    '.yamlog/unreleased/breaking-20170520140000000.yaml'
  );
  expect(changeFile.contents).toMatchSnapshot();
});

it('should write a change with a module specified', async () => {
  mockProject.setup();
  await log('feature', { details: 'Feature 1', module: 'a-module' });
  const changeFile = await mockProject.readChangeFile();
  mockProject.teardown();
  expect(changeFile.contents).toMatchSnapshot();
});

it('should write the details only if a module is not specified', async () => {
  mockProject.setup();
  await log('feature', { details: 'Feature 1', module: '' });
  const changeFile = await mockProject.readChangeFile();
  mockProject.teardown();
  expect(changeFile.contents).toMatchSnapshot();
});
