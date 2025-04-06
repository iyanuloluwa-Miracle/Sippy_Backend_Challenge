module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.js'], // Updated path
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.(spec|test)\\.js$',
  transform: {
    '^.+\\.js$': 'babel-jest', // Add this for JavaScript files
    '^.+\\.ts$': 'ts-jest',    // Keep this for TypeScript files
  },
  collectCoverageFrom: [
    '**/*.{js,ts}',
    '!**/node_modules/**',
    '!**/tests/**',        // Updated to match folder name
    '!**/coverage/**'
  ],
  coverageDirectory: './coverage',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};