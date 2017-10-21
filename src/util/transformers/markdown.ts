import { VersionString } from '../../types/version';
import {
  ChangelogVersion,
  ChangelogVersionMetadata,
  ChangeType,
} from '../../types/changelog';

type ChangeTypeHeadingMap = { [key in ChangeType]: string };

// TODO: Refactor to make more declarative + add generic transformer function

const changeTypeHeadingMap: ChangeTypeHeadingMap = {
  breaking: 'BREAKING CHANGES',
  feature: 'Feature',
  fix: 'Fix',
};

export default (
  version: VersionString,
  changes: ChangelogVersion,
  metadata?: ChangelogVersionMetadata
) => {
  const lines: string[] = [];

  let versionHeader = `## ${version}`;
  versionHeader += metadata ? ` (${metadata.date})` : '';
  lines.push(versionHeader);

  Object.keys(changeTypeHeadingMap).forEach((changeType: ChangeType) => {
    const changeTypeChanges = changes[changeType];
    if (changeTypeChanges) {
      lines.push(`### ${changeTypeHeadingMap[changeType]}`);
      changeTypeChanges.forEach(change => {
        if (typeof change === 'string') {
          lines.push(`* ${change}`);
        } else {
          // TODO: detailed change
        }
      });
    }
  });

  return `${lines.join('\n')}\n`;
};
