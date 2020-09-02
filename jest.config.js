export default {
  coverageDirectory: 'coverage',
  preset: 'ts-jest',
  resolver: 'jest-ts-webcompat-resolver',
  testEnvironment: 'node',
  watchPathIgnorePatterns: ['<rootDir>/node_modules/'],
  watchman: true,
}
