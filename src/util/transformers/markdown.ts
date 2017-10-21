import { VersionString } from '../../types/version';
import { ChangelogVersion, ChangeType } from '../../types/changelog';

type ChangeTypeHeadingMap = { [key in ChangeType]: string };

// TODO: Refactor to make more declarative + add generic transformer function

const changeTypeHeadingMap: ChangeTypeHeadingMap = {
  breaking: 'BREAKING CHANGES',
  feature: 'Feature',
  fix: 'Fix',
};

export default (version: VersionString, changes: ChangelogVersion) => {
  const lines: string[] = [];

  // TODO: Metadata
  lines.push(`## ${version}`);
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
