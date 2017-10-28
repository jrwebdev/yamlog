import * as Listr from 'listr';
import * as execa from 'execa';
import { existsSync, copy } from 'fs-extra';

import config from '../util/config';
import bumpVersion from '../lib/bump-version';

interface Task {
  title: string;
  // TODO: Fix types
  enabled?: (ctx: any) => boolean;
  skip?: (ctx: any) => boolean;
  task: (ctx: any, task: any) => Promise<any>;
}

// TODO: Rename to release to avoid conflict with npm publish/yarn publish?
// TODO: Check no changes to be pulled?
const run = async () => {
  const { publish: publishConfig = {} } = config;

  // TODO: Check for publish dir
  const copyFiles = publishConfig.copyFiles
    ? publishConfig.copyFiles
    : ['package.json', 'LICENSE', 'README.md'];

  console.log();
  console.log('yamlog publish');

  const enabled = (ctx: any) => ctx.enabled !== false;

  const tasks: Task[] = [
    {
      title: 'Checking branch is master',
      enabled,
      task: async (ctx, task) => {
        const branch = await execa.stdout('git', [
          'rev-parse',
          '--abbrev-ref',
          'HEAD',
        ]);

        // TODO: Allow branch to be customisable
        if (branch !== 'master') {
          ctx.enabled = false;
          task.skip('Not on master, skipping publish');
        }
      },
    },
    {
      title: 'Checking branch is up-to-date',
      enabled,
      task: async (ctx, task) => {
        await execa('git', ['fetch']);
        const updates = await execa.stdout('git', [
          'log',
          'HEAD..origin/master',
          '--oneline',
        ]);

        if (updates) {
          ctx.enabled = false;
          task.skip('Branch is not up-to-date, skipping publish');
        }
      },
    },
    {
      // TODO: Option to disable bump
      title: 'Bumping version',
      enabled,
      task: async (ctx, task) => {
        ctx.newVersion = await bumpVersion(config);
        if (!ctx.newVersion) {
          ctx.enabled = false;
          task.skip('No new changes found, skipping publish');
        }
      },
    },
    {
      title: `Copying files to ${publishConfig.dir}/`,
      enabled,
      task: async () =>
        Promise.all(
          copyFiles.map(async file => {
            // TODO: Throw error if file not found?
            if (existsSync(file)) {
              await copy(file, `dist/${file}`);
            }
          })
        ),
    },
    {
      title: 'Publishing npm package',
      enabled,
      task: () =>
        execa('npm', ['publish'], {
          cwd: publishConfig.dir || process.cwd(),
        }),
    },
    {
      // TODO: Only needed if bump is performed
      title: 'Committing file changes',
      enabled,
      task: ctx =>
        execa.shell(
          `git commit .yamlog package.json CHANGELOG.md -m "v${ctx.newVersion}" --no-verify`
        ),
    },
    {
      title: 'Tagging release',
      enabled,
      task: ctx => execa.shell(`git tag v${ctx.newVersion}`),
    },
    {
      title: 'Pushing changes to repository',
      enabled,
      task: () =>
        execa.shell('git push origin HEAD:master && git push --tags origin'),
    },
  ];

  console.log();
  new Listr(tasks)
    .run()
    // TODO: Fix type
    .then((ctx: any) => {
      if (ctx.newVersion) {
        console.log(`\nv${ctx.newVersion} published successfully\n`);
      }
      // console.log(
      //   `\n ${chalk.bold(
      //     `${lib.packageJson.getName()}@${ctx.newVersion} ${chalk.green(
      //       'published successfully'
      //     )}`
      //   )}\n`
      // );
    })
    .catch((err: string) => {
      // TODO: Improve error output
      // TODO: Roll back publish on error?
      console.error(err);
      // TODO: Only reset/remove package.json/changelog.yaml/unreleased dir/CHANGELOG.md
      execa.shellSync('git reset --hard && git clean -f -d');
      process.exit(1);
    });
};

run();
