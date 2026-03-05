module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests/unit/', '<rootDir>/tests', '<rootDir>/src'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest'
  },
  transformIgnorePatterns: ['/node_modules/(?!@pega/auth)'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  coverageDirectory: 'tests/coverage',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  }
};
