import { createMockProject } from './test-utils';

import bumpVersion from '../src/lib/bump-version';

let mockProject: any;

beforeEach(() => {
  mockProject = createMockProject();
  expect.hasAssertions();
});

afterEach(async () => {
  const changelog = await mockProject.readChangelog();
  mockProject.teardown();
  expect(changelog).toMatchSnapshot();
});

it('should leave the changelog unchanged if there are no unreleased changes', async () => {
  mockProject.setup({
    '1.0.0': {
      metadata: { date: '2017-01-01' },
      feature: ['Feature 1'],
    },
  });
  await bumpVersion();
});

it('should bump a patch version if there are unreleased fixes', async () => {
  mockProject.setup({
    unreleased: {
      fix: ['Fix 1'],
    },
    '1.0.0': {
      metadata: { date: '2017-01-01' },
      feature: ['Feature 1'],
    },
  });
  await bumpVersion();
});

it('should bump a minor version if there are unreleased features', async () => {
  mockProject.setup({
    unreleased: {
      feature: ['Feature 1'],
      fix: ['Fix 1'],
    },
    '1.0.0': {
      metadata: { date: '2017-01-01' },
      feature: ['Feature 1'],
    },
  });
  await bumpVersion();
});

it('should bump a major version if there are unreleased breaking changes', async () => {
  mockProject.setup({
    unreleased: {
      breaking: ['Breaking Change 1'],
      feature: ['Feature 1'],
      fix: ['Fix 1'],
    },
    '1.0.0': {
      metadata: { date: '2017-01-01' },
      feature: ['Feature 1'],
    },
  });
  await bumpVersion();
});

it('should bump a patch version if there are unreleased fixes for an unstable project', async () => {
  mockProject.setup({
    unreleased: {
      fix: ['Fix 1'],
    },
    '0.1.0': {
      metadata: { date: '2017-01-01' },
      feature: ['Feature 1'],
    },
  });
  await bumpVersion({ unstable: true });
});

it('should bump a patch version if there are unreleased features for an unstable project', async () => {
  mockProject.setup({
    unreleased: {
      feature: ['Feature 1'],
      fix: ['Fix 1'],
    },
    '0.1.0': {
      metadata: { date: '2017-01-01' },
      feature: ['Feature 1'],
    },
  });
  await bumpVersion({ unstable: true });
});

it('should bump a minor version if there are unreleased fixes for an unstable project', async () => {
  mockProject.setup({
    unreleased: {
      breaking: ['Breaking Change 1'],
      feature: ['Feature 1'],
      fix: ['Fix 1'],
    },
    '0.1.0': {
      metadata: { date: '2017-01-01' },
      feature: ['Feature 1'],
    },
  });
  await bumpVersion({ unstable: true });
});

it('should bump to v1 regardless of change type if an unstable project is now stable', async () => {
  mockProject.setup({
    unreleased: {
      fix: ['Fix 1'],
    },
    '0.1.0': {
      metadata: { date: '2017-01-01' },
      feature: ['Feature 1'],
    },
  });
  await bumpVersion();
});

it('should ignore the unstable option if the project is already at v1', async () => {
  mockProject.setup({
    unreleased: {
      breaking: ['Breaking Change 1'],
    },
    '1.0.0': {
      metadata: { date: '2017-01-01' },
      feature: ['Feature 1'],
    },
  });
  await bumpVersion({ unstable: true });
});

describe('unreleased directory', () => {
  it('should bump a patch version if there is a fix file in the unreleased directory', async () => {
    mockProject.setup(
      {
        '1.0.0': {
          metadata: { date: '2017-01-01' },
          feature: ['Feature 1'],
        },
      },
      {
        breaking: [],
        feature: [],
        fix: ['Fix 1', 'Fix 2'],
      }
    );
    await bumpVersion({ unreleasedDir: '.yamlog-unreleased' });
  });

  it('should bump a minor version if there is a feature file in the unreleased directory', async () => {
    mockProject.setup(
      {
        '1.0.0': {
          metadata: { date: '2017-01-01' },
          feature: ['Feature 1'],
        },
      },
      {
        breaking: [],
        fix: ['Fix 1'],
        feature: ['Feature 1', 'Feature 2', 'Feature 3'],
      }
    );
    await bumpVersion({ unreleasedDir: '.yamlog-unreleased' });
  });

  it('should bump a breaking version if there is a breaking file in the unreleased directory', async () => {
    mockProject.setup(
      {
        '1.0.0': {
          metadata: { date: '2017-01-01' },
          feature: ['Feature 1'],
        },
      },
      {
        fix: ['Fix 1'],
        feature: ['Feature 1'],
        breaking: ['Breaking Change 1', 'Breaking Change 2'],
      }
    );
    await bumpVersion({ unreleasedDir: '.yamlog-unreleased' });
  });
});
