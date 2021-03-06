import { existsSync, readFile } from 'fs-extra';
import { createMockProject } from './test-utils';

import bumpVersion from '../src/lib/bump-version';

let mockProject: any;

beforeEach(() => {
  mockProject = createMockProject();
  expect.hasAssertions();
});

afterEach(() => {
  mockProject.teardown();
});

it('should leave the changelog unchanged if there are no unreleased changes', async () => {
  mockProject.setup({
    '1.0.0': {
      metadata: { date: '2017-01-01' },
      feature: ['Feature 1'],
    },
  });
  await bumpVersion();
  const changelog = await mockProject.readChangelog();
  mockProject.teardown();
  expect(changelog).toMatchSnapshot();
});

it('should bump a patch version if there are unreleased fixes', async () => {
  mockProject.setup(
    {
      '1.0.0': {
        metadata: { date: '2017-01-01' },
        feature: ['Feature 1'],
      },
    },
    {
      fix: ['Fix 1'],
    }
  );
  await bumpVersion();
  const changelog = await mockProject.readChangelog();
  mockProject.teardown();
  expect(changelog).toMatchSnapshot();
});

it('should bump a minor version if there are unreleased features', async () => {
  mockProject.setup(
    {
      '1.0.0': {
        metadata: { date: '2017-01-01' },
        feature: ['Feature 1'],
      },
    },
    {
      feature: ['Feature 1'],
      fix: ['Fix 1'],
    }
  );
  await bumpVersion();
  const changelog = await mockProject.readChangelog();
  mockProject.teardown();
  expect(changelog).toMatchSnapshot();
});

it('should bump a major version if there are unreleased breaking changes', async () => {
  mockProject.setup(
    {
      '1.0.0': {
        metadata: { date: '2017-01-01' },
        feature: ['Feature 1'],
      },
    },
    {
      breaking: ['Breaking Change 1'],
      feature: ['Feature 1'],
      fix: ['Fix 1'],
    }
  );
  await bumpVersion();
  const changelog = await mockProject.readChangelog();
  mockProject.teardown();
  expect(changelog).toMatchSnapshot();
});

it('should bump a patch version if there are unreleased fixes for an unstable project', async () => {
  mockProject.setup(
    {
      '0.1.0': {
        metadata: { date: '2017-01-01' },
        feature: ['Feature 1'],
      },
    },
    {
      fix: ['Fix 1'],
    }
  );
  await bumpVersion({ unstable: true });
  const changelog = await mockProject.readChangelog();
  mockProject.teardown();
  expect(changelog).toMatchSnapshot();
});

it('should bump a patch version if there are unreleased features for an unstable project', async () => {
  mockProject.setup(
    {
      '0.1.0': {
        metadata: { date: '2017-01-01' },
        feature: ['Feature 1'],
      },
    },
    {
      feature: ['Feature 1'],
      fix: ['Fix 1'],
    }
  );
  await bumpVersion({ unstable: true });
  const changelog = await mockProject.readChangelog();
  mockProject.teardown();
  expect(changelog).toMatchSnapshot();
});

it('should bump a minor version if there are unreleased fixes for an unstable project', async () => {
  mockProject.setup(
    {
      '0.1.0': {
        metadata: { date: '2017-01-01' },
        feature: ['Feature 1'],
      },
    },
    {
      breaking: ['Breaking Change 1'],
      feature: ['Feature 1'],
      fix: ['Fix 1'],
    }
  );
  await bumpVersion({ unstable: true });
  const changelog = await mockProject.readChangelog();
  mockProject.teardown();
  expect(changelog).toMatchSnapshot();
});

it('should bump to v1 regardless of change type if an unstable project is now stable', async () => {
  mockProject.setup(
    {
      '0.1.0': {
        metadata: { date: '2017-01-01' },
        feature: ['Feature 1'],
      },
    },
    {
      fix: ['Fix 1'],
    }
  );
  await bumpVersion();
  const changelog = await mockProject.readChangelog();
  mockProject.teardown();
  expect(changelog).toMatchSnapshot();
});

it('should ignore the unstable option if the project is already at v1', async () => {
  mockProject.setup(
    {
      '1.0.0': {
        metadata: { date: '2017-01-01' },
        feature: ['Feature 1'],
      },
    },
    {
      breaking: ['Breaking Change 1'],
    }
  );
  await bumpVersion({ unstable: true });
  const changelog = await mockProject.readChangelog();
  mockProject.teardown();
  expect(changelog).toMatchSnapshot();
});

it('should write the version to package.json', async () => {
  mockProject.setup(
    {
      '1.0.0': {
        metadata: { date: '2017-01-01' },
        feature: ['Feature 1'],
      },
    },
    {
      fix: ['Fix 1'],
    }
  );

  await bumpVersion();
  const packageJson = await mockProject.readPackageJson();
  expect(packageJson.version).toEqual('1.0.1');
});

it('should read the version from the package.json if there are no releases', async () => {
  mockProject.setup(
    {},
    {
      fix: ['Fix 1'],
    },
    {
      'package.json': JSON.stringify({ version: '5.1.4' }),
    }
  );

  await bumpVersion();
  const packageJson = await mockProject.readPackageJson();
  expect(packageJson.version).toEqual('5.1.5');
});

it('should write a CHANGELOG.md file', async () => {
  mockProject.setup(
    {},
    {
      feature: ['Feature 1', 'Feature 2'],
      fix: ['Fix 1', 'Fix 2'],
    }
  );

  await bumpVersion();
  const changelogMd = await readFile('CHANGELOG.md');
  mockProject.teardown();
  expect(changelogMd.toString()).toMatchSnapshot();
});

it('should add to an existing CHANGELOG.md file', async () => {
  mockProject.setup(
    {
      '1.0.0': {
        metadata: { date: '2017-01-01' },
        feature: ['Feature 1'],
      },
    },
    {
      feature: ['Feature 1', 'Feature 2'],
      fix: ['Fix 1'],
      breaking: ['Breaking Change 1'],
    },
    {
      'CHANGELOG.md': [
        '## 1.0.0 (2017-01-01)',
        '### Features',
        '* Feature 1',
        '\n',
      ].join('\n'),
    }
  );

  await bumpVersion();
  const changelogMd = await readFile('CHANGELOG.md');
  mockProject.teardown();
  expect(changelogMd.toString()).toMatchSnapshot();
});
