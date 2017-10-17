const path = require('path');

const yamlSerializer = path.resolve('config/yaml-serializer');

module.exports = {
  roots: ['<rootDir>src'],
  transform: {
    '.tsx?$': 'ts-jest/preprocessor',
  },
  transformIgnorePatterns: ['node_modules'],
  testRegex: '\\.test\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  snapshotSerializers: [yamlSerializer],
  coverageDirectory: '<rootDir>build/coverage/',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/*.test.{ts,tsx}',
    '!**/*.d.ts',
    '!**/types/**/*.*',
    '!**/index.ts',
  ],
  mapCoverage: true,
};
