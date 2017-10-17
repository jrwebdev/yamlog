import { ChangeType, Change } from '../types/changelog';
import * as changelogFile from './changelog-file';

export const addChange = (changeType: ChangeType, change: Change) =>
  changelogFile.addChange(changeType, change);
