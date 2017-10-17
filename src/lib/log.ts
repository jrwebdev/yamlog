import { Change, ChangeType } from '../types/changelog';
import * as changelog from '../util/changelog';

export default (changeType: ChangeType, change: Change) =>
  changelog.addChange(changeType, change);
