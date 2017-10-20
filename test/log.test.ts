import { createMockProject } from './test-utils';

import log from '../src/lib/log';

let mockProject: any;

beforeEach(() => {
  mockProject = createMockProject();
  expect.hasAssertions();
});

describe('changelog', () => {
  afterEach(async () => {
    const changelog = await mockProject.readChangelog();
    mockProject.teardown();
    expect(changelog).toMatchSnapshot();
  });

  it('should create a new changelog.yaml file and add a change', async () => {
    mockProject.setup();
    await log('fix', 'Fix 1');
  });

  it('should create a new unreleased section and add a change', async () => {
    mockProject.setup({
      '1.0.0': {
        metadata: { date: '2017-01-01' },
        feature: ['Feature 1'],
      },
    });
    await log('fix', 'Fix 1');
  });

  it('should add a change to an existing unreleased section', async () => {
    mockProject.setup({
      unreleased: {
        feature: ['Feature 1'],
      },
      '1.0.0': {
        metadata: { date: '2017-01-01' },
        feature: ['Feature 1'],
      },
    });
    await log('feature', 'Feature 2');
  });

  it('should add a fix', async () => {
    mockProject.setup({
      unreleased: {
        fix: ['Fix 1'],
      },
      '1.0.0': {
        metadata: { date: '2017-01-01' },
        feature: ['Feature 1'],
      },
    });
    await log('fix', 'Fix 2');
  });

  it('should add a feature', async () => {
    mockProject.setup({
      unreleased: {
        fix: ['Fix 1'],
      },
      '1.0.0': {
        metadata: { date: '2017-01-01' },
        feature: ['Feature 1'],
      },
    });
    await log('feature', 'Feature 1');
  });

  it('should add a breaking change', async () => {
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
    await log('breaking', 'Breaking Change 1');
  });
});

describe('unreleased directory', () => {
  afterEach(async () => {
    const changeFile = await mockProject.readChangeFile();
    const changelog = await mockProject.readChangelog();
    mockProject.teardown();
    expect(changeFile.contents).toMatchSnapshot(
      'unreleased directory (change file contents)'
    );
    expect(changeFile.filename).toMatchSnapshot(
      'unreleased directory (change file filename)'
    );
    expect(changelog).toMatchSnapshot('unreleased directory (changelog)');
  });

  it('should write a fix to the unreleased directory', async () => {
    mockProject.setup({
      '1.0.0': {
        metadata: { date: '2017-01-01' },
        feature: ['Feature 1'],
      },
    });
    await log('fix', 'Fix 1', { unreleasedDir: '.yamlog-unreleased' });
  });

  it('should write a feature to the unreleased directory', async () => {
    mockProject.setup({
      '1.0.0': {
        metadata: { date: '2017-01-01' },
        feature: ['Feature 1'],
      },
    });
    await log('feature', 'Feature 1', { unreleasedDir: '.yamlog-unreleased' });
  });

  it('should write a breaking change to the unreleased directory', async () => {
    mockProject.setup({
      '1.0.0': {
        metadata: { date: '2017-01-01' },
        feature: ['Feature 1'],
      },
    });
    await log('breaking', 'Breaking Change 1', {
      unreleasedDir: '.yamlog-unreleased',
    });
  });
});
