const path = require('path');

module.exports = {
  roots: ['<rootDir>src', '<rootDir>test'],
  transform: {
    '.tsx?$': 'ts-jest/preprocessor',
  },
  transformIgnorePatterns: ['node_modules'],
  testRegex: '\\.test\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  snapshotSerializers: ['<rootDir>test/test-utils/serializers/value'],
  coverageDirectory: '<rootDir>build/coverage/',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/*.test.{ts,tsx}',
    '!**/*.d.ts',
    '!**/types/**/*.*',
    '!**/index.ts',
    '!**/bin/**/*.*',
  ],
  mapCoverage: true,
};
