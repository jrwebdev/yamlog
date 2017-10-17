import { Changelog } from '../types/changelog';
import { read, write } from './yaml-file';

import { getMock } from './test';

import { addChange } from './changelog-file';

jest.mock('fs-extra', () => ({
  existsSync: () => true,
}));

jest.mock('./yaml-file');

let mockChangelog: Changelog;

const getOutput = () => getMock(write).mock.calls[0][1];

beforeEach(() => {
  mockChangelog = {
    unreleased: {
      breaking: ['a breaking change'],
      feature: ['a feature'],
      fix: ['a fix'],
    },
    '0.1.0': {
      metadata: {
        date: '2017-01-01',
      },
      feature: ['a feature'],
    },
  };

  getMock(read).mockImplementation(() => Promise.resolve(mockChangelog));
  getMock(write).mockImplementation(() => Promise.resolve());

  expect.hasAssertions();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('addChange', () => {
  it('should write a change to the changelog.yaml file', async () => {
    await addChange('feature', '** NEW CHANGE **');
    expect(write).toHaveBeenCalledWith('changelog.yaml', jasmine.anything());
  });

  it('should write a change to the start of the breaking section', async () => {
    await addChange('breaking', '** NEW CHANGE **');
    expect(getOutput()).toMatchSnapshot();
  });

  it('should write a change to the start of the feature section', async () => {
    await addChange('feature', '** NEW CHANGE **');
    expect(getOutput()).toMatchSnapshot();
  });

  it('should write a change to the start of the fix section', async () => {
    await addChange('fix', '** NEW CHANGE **');
    expect(getOutput()).toMatchSnapshot();
  });

  it('should create a new unreleased section if one does not exist', async () => {
    delete mockChangelog.unreleased;
    await addChange('feature', '** NEW CHANGE **');
    expect(getOutput()).toMatchSnapshot();
  });

  it('should create a new change type section if one does not exist', async () => {
    delete mockChangelog.unreleased.feature;
    await addChange('feature', '** NEW CHANGE **');
    expect(getOutput()).toMatchSnapshot();
  });

  it('should strip out any empty sections', async () => {
    mockChangelog.unreleased = {
      breaking: [],
      feature: [],
      fix: mockChangelog.unreleased.fix,
    };
    await addChange('fix', '** NEW CHANGE **');
    expect(getOutput()).toMatchSnapshot();
  });

  it('should reorganise the change types if they are out of order', async () => {
    mockChangelog.unreleased = {
      fix: mockChangelog.unreleased.fix,
      breaking: mockChangelog.unreleased.breaking,
      feature: mockChangelog.unreleased.feature,
    };
    await addChange('fix', '** NEW CHANGE **');
    expect(getOutput()).toMatchSnapshot();
  });

  it('should output a detailed changelog entry', async () => {
    await addChange('feature', {
      details: '** NEW CHANGE **',
      module: 'module',
    });
    expect(getOutput()).toMatchSnapshot();
  });

  it('should add the change as a string if the detailed changelog entry only contains details', async () => {
    await addChange('feature', { details: '** NEW CHANGE **' });
    expect(getOutput()).toMatchSnapshot();
  });
});
