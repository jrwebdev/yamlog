import { createMockProject } from './utils';

import bumpVersion from '../src/lib/bump-version';

let mockProject: any;

beforeEach(() => {
  mockProject = createMockProject('bump-version');
  expect.hasAssertions();
});

afterEach(() => {
  mockProject.teardown();
});

it('should bump the patch version for a fix', async () => {
  await mockProject.setup({
    unreleased: {
      fix: ['Fix 1'],
    },
    '1.0.0': {
      metadata: { date: '2017-01-01' },
      feature: ['Feature 1'],
    },
  });
  await bumpVersion();
  const changelog = await mockProject.readChangelog();
  expect(changelog).toMatchSnapshot();
});
