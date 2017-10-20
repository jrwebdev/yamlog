import { ChangelogConfig } from '../types/config';
import { Change, ChangeType } from '../types/changelog';
import * as changelog from '../util/changelog';

export default (
  changeType: ChangeType,
  change: Change,
  config: ChangelogConfig = {}
) =>
  changelog.addChange(changeType, change, {
    unreleasedDir: config.unreleasedDir || '',
  });
