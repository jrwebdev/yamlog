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
// TODO: Check branch is master?
// TODO: Check no changes to be pulled?
// TODO: Check node_modules are up-to-date?
const run = async () => {
  const { publish: publishConfig = {} } = config;

  const tasks: Task[] = [];

  // TODO: Fix type
  // const newVersion = await bumpVersion(config);

  console.log();
  console.log('yamlog publish');

  tasks.push({
    title: 'Bumping version',
    task: async (ctx, task) => {
      ctx.newVersion = await bumpVersion(config);
      if (!ctx.newVersion) {
        task.skip('No new changes found, skipping publish');
      }
    },
  });

  // TODO: Pre-publish

  if (publishConfig.dir) {
    const copyFiles = publishConfig.copyFiles
      ? publishConfig.copyFiles
      : ['package.json', 'LICENSE', 'README.md'];

    if (publishConfig.copyFiles !== false && copyFiles && copyFiles.length) {
      tasks.push({
        title: `Copying files to ${publishConfig.dir}/`,
        enabled: ctx => !!ctx.newVersion,
        task: async () =>
          Promise.all(
            copyFiles.map(async file => {
              // TODO: Throw error if file not found?
              if (existsSync(file)) {
                await copy(file, `dist/${file}`);
              }
            })
          ),
      });
    }
  }

  tasks.push({
    title: 'Publishing npm package',
    enabled: ctx => !!ctx.newVersion,
    task: () =>
      execa.shell('npm publish', {
        cwd: publishConfig.dir || process.cwd(),
        stdio: 'inherit',
      }),
  });

  if (publishConfig.commit !== false) {
    tasks.push({
      title: 'Committing file changes',
      enabled: ctx => !!ctx.newVersion,
      task: ctx =>
        execa.shell(
          `git commit package.json changelog.yaml CHANGELOG.md -m "v${ctx.newVersion}" --no-verify`,
          {
            stdio: 'inherit',
          }
        ),
    });
  }

  if (publishConfig.tag !== false) {
    tasks.push({
      title: 'Tagging release',
      enabled: ctx => !!ctx.newVersion,
      task: ctx =>
        execa.shell(`git tag v${ctx.newVersion}`, {
          stdio: 'inherit',
        }),
    });
  }

  if (publishConfig.push !== false) {
    tasks.push({
      title: 'Pushing changes to repository',
      enabled: ctx => !!ctx.newVersion,
      task: () =>
        execa.shell('git push origin && git push --tags origin', {
          stdio: 'inherit',
        }),
    });
  }

  console.log();
  new Listr(tasks)
    .run()
    // TODO: Fix type
    .then((ctx: any) => {
      console.log();
      console.log(`v${ctx.newVersion} published successfully`);
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
      // TODO: Only reset/remove package.json/changelog.yaml/CHANGELOG.md
      execa.shellSync('git reset --hard && git clean -f -d');
      process.exit(1);
    });
};

run();
