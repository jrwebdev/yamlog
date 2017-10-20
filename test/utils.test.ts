import { createMockProject } from './utils';

let mockProject: any;

beforeEach(() => {
  mockProject = createMockProject();
  expect.hasAssertions();
});

afterEach(() => {
  mockProject.teardown();
});

it('should write a changelog', async () => {
  await mockProject.setup({
    '0.1.0': {
      metadata: { date: '2017-01-01' },
      feature: ['Feature 1'],
    },
  });
  const changelog = await mockProject.readChangelog();
  expect(changelog).toMatchSnapshot();
});
