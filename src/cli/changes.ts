import config from '../util/config';
import { default as changesLib } from '../lib/changes';

const run = async () => {
  const transform = 'yaml';
  const changes = await changesLib({ transform }, config);
  console.log(changes);
};

run();
