/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.ts', '!**/*.d.ts', '!**/test/setup.ts'],
  setupFiles: ['./test/setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: './test/tsconfig.json',
    },
  },
  testPathIgnorePatterns: ['/node_modules/', '\\.d\\.ts$'],
};
