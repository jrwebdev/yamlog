import * as execa from 'execa';

import getBranch from './getBranch';

const isBranchUpToDate = async (branch?: string) => {
  const branchToCheck = branch || (await getBranch());

  await execa('git', ['fetch']);
  const updates = await execa.stdout('git', [
    'log',
    `HEAD..origin/${branchToCheck}`,
    '--oneline',
  ]);

  return !updates;
};

export default isBranchUpToDate;
