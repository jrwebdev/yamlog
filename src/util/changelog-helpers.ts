import { ChangeType, Change, ChangelogVersion } from '../types/changelog';

const changeTypeKeys: ChangeType[] = ['breaking', 'feature', 'fix'];
const defaultVersionKeyOrder: Array<'metadata' | ChangeType> = [
  'metadata',
  ...changeTypeKeys,
];

const sortVersionChangeTypeEntries = (version: ChangelogVersion) =>
  defaultVersionKeyOrder.reduce(
    (acc, key) => (version[key] ? { ...acc, [key]: version[key] } : acc),
    {}
  );

const stripEmptyChangeTypes = (version: ChangelogVersion) =>
  changeTypeKeys.reduce(
    (acc, key) => {
      // TODO: Fix type
      if (acc[key] && !(acc as any)[key].length) {
        delete acc[key];
      }
      return acc;
    },
    { ...version }
  );

export const addChangeToVersionChangeType = (
  type: ChangeType,
  change: Change,
  version: ChangelogVersion
): Change[] => [change, ...(version[type] || [])];

export const updateVersionChangeTypeEntries = (
  version: ChangelogVersion = {},
  type: ChangeType,
  updates: Change[]
): ChangelogVersion =>
  sortVersionChangeTypeEntries(
    stripEmptyChangeTypes({
      ...version,
      [type]: updates,
    })
  );