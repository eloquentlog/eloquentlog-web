// https://jestjs.io/docs/en/configuration.html
const { defaults: tsPreset } = require('ts-jest/presets');

module.exports = {
  preset: 'ts-jest'
, coverageDirectory: '.coverage'
, globals: {
    'ts-jest': {
      'tsConfig': 'tsconfig.json'
    }
  }
, moduleFileExtensions: [
    'ts'
  , 'js' // for external modules
  ]
, moduleNameMapper: {
    '.*\\.styl$': '<rootDir>/tests/styl.dummy.ts'
  }
, transform: {
    ...tsPreset.transform
  }
, setupTestFrameworkScriptFile: '<rootDir>/tests/enzyme.ts'
};
