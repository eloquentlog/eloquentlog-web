// https://jestjs.io/docs/en/configuration.html
module.exports = {
  coverageDirectory: "dst/coverage"
, coverageProvider: "v8"
, moduleDirectories: [
    "node_modules"
  ]
, moduleFileExtensions: [
    "js"
  ]
, testMatch: [
    "**/test/dst/**/*.js"
  ]
, testPathIgnorePatterns: [
    "/node_modules/"
  ]
, transform: {}
};
