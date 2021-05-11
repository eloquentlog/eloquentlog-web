// https://jestjs.io/docs/en/configuration.html
module.exports = {
  collectCoverage: false
, collectCoverageFrom: [
    '**/src/**/*.ts'
  ]
, coverageDirectory: 'test/dst/coverage'
, coverageProvider: 'v8'
, coverageReporters: [
    'text'
  ]
, moduleDirectories: [
    'node_modules'
  ]
, moduleFileExtensions: [
    'js'
  , 'ts'
  ]
, moduleNameMapper: {
    '\\.(css|styl)$': 'identity-obj-proxy'
  }
, setupFilesAfterEnv: [
    './test/jest.setup.js'
  ]
, testEnvironment: 'jsdom'
, testMatch: [
    '**/test/**/*.ts'
  ]
, testPathIgnorePatterns: [
    '/node_modules/'
  ]
, transform: {
    '^.+\\.ts?$': 'ts-jest'
  }
};
