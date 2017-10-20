import { ChangelogConfig } from '../types/config';
import * as changelog from '../util/changelog';

export default (config: ChangelogConfig = {}) => changelog.bumpVersion(config);
