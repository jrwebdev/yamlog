import { createMockProject } from './utils';

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

it('should write a changelog', async () => {
  await mockProject.setup({
    '0.1.0': {
      metadata: { date: '2017-01-01' },
      feature: ['Feature 1'],
    },
  });
});
