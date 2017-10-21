import { VersionString } from '../../types/version';
import {
  ChangelogVersion,
  ChangelogVersionMetadata,
  ChangeType,
} from '../../types/changelog';

type ChangeTypeHeadingMap = { [key in ChangeType]: string };

const changeTypeHeadingMap: ChangeTypeHeadingMap = {
  breaking: 'BREAKING CHANGES',
  feature: 'Features',
  fix: 'Fixes',
};

// TODO: Refactor to make more declarative + add generic format function
// TODO: Change to accept either a changelog or a changelog version

export default (
  changes: ChangelogVersion,
  version?: VersionString,
  metadata?: ChangelogVersionMetadata
) => {
  const lines: string[] = [];

  if (version) {
    let versionHeader = `## ${version}`;
    versionHeader += metadata ? ` (${metadata.date})` : '';
    lines.push(versionHeader);
  }

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
