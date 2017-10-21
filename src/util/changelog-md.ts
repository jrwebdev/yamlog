import { readFile, writeFile, existsSync } from 'fs-extra';

const file = 'CHANGELOG.md';

const read = async () => {
  if (!existsSync(file)) return '';
  const contents = await readFile(file);
  return contents.toString();
};

export const prepend = async (markdown: string) => {
  const existing = await read();
  return writeFile(file, `${markdown}\n${existing}`);
};
