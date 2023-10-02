module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json'],

  // A list of paths to directories that Jest should use to search for files in
  roots: [
    '<rootDir>/src', // Adjust this to match your source code directory
  ],

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: [
    '/node_modules/',
  ],

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // Babel
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest'
  }
};
