import * as execa from 'execa';

const getBranch = async () =>
  execa.stdout('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

export default getBranch;
