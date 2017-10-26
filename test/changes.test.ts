import { existsSync, readFile } from 'fs-extra';
import { createMockProject } from './test-utils';

import { Changelog } from '../src/types/changelog';
import changes from '../src/lib/changes';

let mockProject: any;
let mockChangelog: Changelog;

beforeEach(() => {
  mockChangelog = {
    unreleased: {
      breaking: ['Breaking Change 1'],
      feature: ['Feature 1', 'Feature 2'],
      fix: ['Fix 1', 'Fix 2'],
    },
    '2.1.0': {
      metadata: { date: '2017-01-05' },
      feature: ['Feature 1', 'Feature 2'],
      fix: ['Fix 1'],
    },
    '2.0.1': {
      metadata: { date: '2017-01-04' },
      fix: ['Fix 1'],
    },
    '2.0.0': {
      metadata: { date: '2017-01-03' },
      breaking: ['Breaking Change 1'],
      feature: ['Feature 1'],
    },
    '1.0.0': {
      metadata: { date: '2017-01-02' },
      feature: ['Feature 1'],
    },
    '0.2.0': {
      metadata: { date: '2017-01-01' },
      feature: ['Feature 1'],
    },
    '0.1.0': {
      metadata: { date: '2017-01-01' },
      feature: ['Feature 1'],
    },
  };

  mockProject = createMockProject();
  mockProject.setup(mockChangelog);
  expect.hasAssertions();
});

afterEach(() => {
  mockProject.teardown();
});

const testSnapshot = (expected: any) => {
  // Needed so loading the snapshot files isn't mocked
  mockProject.teardown();
  expect(expected).toMatchSnapshot();
};

it('should return all changes for the project except unreleased', async () => {
  const c = await changes();
  testSnapshot(JSON.stringify(c, null, 2));
});

it('should return changes in JSON', async () => {
  const c = await changes({ format: 'json' });
  testSnapshot(c);
});

it('should return changes in Yaml', async () => {
  const c = await changes({ format: 'yaml' });
  testSnapshot(c);
});

it('should return changes in markdown', async () => {
  const c = await changes({ format: 'markdown' });
  testSnapshot(c);
});

// TODO
xit('should return changes in plain text', async () => {
  const c = await changes({ format: 'text' });
  testSnapshot(c);
});

it('should return a single version', async () => {
  const c = await changes({ format: 'yaml', version: '2.0.0' });
  testSnapshot(c);
});

it('should return a single version in markdown', async () => {
  const c = await changes({ format: 'markdown', version: '2.0.0' });
  testSnapshot(c);
});

it('should return unreleased changes', async () => {
  const c = await changes({ format: 'yaml', version: 'unreleased' });
  testSnapshot(c);
});

// TODO: Fix
it('should return unreleased changes in markdown', async () => {
  const c = await changes({ format: 'markdown', version: 'unreleased' });
  testSnapshot(c);
});

it('should return unreleased changes from change files', async () => {
  mockProject = createMockProject();
  mockProject.setup(
    {
      '0.1.0': {
        metadata: { date: '2017-01-01' },
        feature: ['Feature 1'],
      },
    },
    {
      breaking: ['Breaking 1', 'Breaking 2'],
      feature: ['Feature 1', 'Feature 2'],
      fix: ['Fix 1', 'Fix 2'],
    }
  );

  const c = await changes({ format: 'yaml', version: 'unreleased' });
  testSnapshot(c);
});

it('should return the latest version', async () => {
  const c = await changes({ format: 'yaml', version: 'latest' });
  testSnapshot(c);
});

it('should return a range of versions', async () => {
  const c = await changes({
    format: 'yaml',
    version: { from: '0.2.0', to: '2.0.0' },
  });
  testSnapshot(c);
});

it('should filter and sort versions correctly when returning a range', async () => {
  mockChangelog = {
    unreleased: {
      fix: ['Fix 1'],
    },
    '10.0.0': {
      metadata: { date: '2017-01-01' },
      fix: ['Fix 1'],
    },
    '2.0.0': {
      metadata: { date: '2017-01-01' },
      fix: ['Fix 1'],
    },
    '1.10.0': {
      metadata: { date: '2017-01-01' },
      fix: ['Fix 1'],
    },
    '1.2.0': {
      metadata: { date: '2017-01-01' },
      fix: ['Fix 1'],
    },
    '1.1.0': {
      metadata: { date: '2017-01-01' },
      fix: ['Fix 1'],
    },
    '1.1.100': {
      metadata: { date: '2017-01-01' },
      fix: ['Fix 1'],
    },
    '1.1.2': {
      metadata: { date: '2017-01-01' },
      fix: ['Fix 1'],
    },
    '1.1.1': {
      metadata: { date: '2017-01-01' },
      fix: ['Fix 1'],
    },
    '1.0.0': {
      metadata: { date: '2017-01-01' },
      fix: ['Fix 1'],
    },
    '0.1.0': {
      metadata: { date: '2017-01-01' },
      fix: ['Fix 1'],
    },
  };
  mockProject = createMockProject();
  mockProject.setup(mockChangelog);
  const c = await changes({
    version: { from: '1.0.0', to: '2.0.0' },
  });
  expect(Object.keys(c)).toEqual([
    '2.0.0',
    '1.10.0',
    '1.2.0',
    '1.1.100',
    '1.1.2',
    '1.1.1',
    '1.1.0',
    '1.0.0',
  ]);
});

it('should return a version from a specified version to the latest version', async () => {
  const c = await changes({ format: 'yaml', version: { from: '1.0.0' } });
  testSnapshot(c);
});
