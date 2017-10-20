import { createMockProject } from './utils';

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
