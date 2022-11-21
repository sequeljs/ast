export default {
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageReporters: ['clover', 'cobertura', 'json', 'lcov', 'text'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  watchPathIgnorePatterns: ['<rootDir>/node_modules/'],
  watchman: true,
}
