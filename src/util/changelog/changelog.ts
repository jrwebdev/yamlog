import { compose } from 'ramda';
import {
  ChangeType,
  Change,
  DetailedChange,
  ChangelogVersion,
} from './changelog.types';

import * as unreleasedDir from './unreleased-dir';

const changeTypeKeys: ChangeType[] = ['breaking', 'feature', 'fix'];

const isDetailedChange = (change: any): change is DetailedChange =>
  typeof change === 'object';

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

const stripEmptyChangeProperties = (change: Change): DetailedChange | Change =>
  isDetailedChange(change)
    ? Object.keys(change).reduce((acc, property) => {
        const value = (change as any)[property];
        if (value && value.trim()) {
          (acc as any)[property] = value;
        }
        return acc;
      }, {}) as DetailedChange
    : change;

const flattenDetails = (change: Change) =>
  typeof change !== 'string' &&
  Object.keys(change).length === 1 &&
  change.details
    ? change.details
    : change;

const processChange = compose(flattenDetails, stripEmptyChangeProperties);

export const addChange = (changeType: ChangeType, change: Change) => {
  const processedChange = processChange(change);
  unreleasedDir.addChange(changeType, processedChange);
};
