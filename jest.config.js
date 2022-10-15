const config = {
  "roots": ["<rootDir>/src"],
  "clearMocks": true,
  "collectCoverageFrom": ["<rootDir>/src/**/*.ts", "!<rootDir>/src/main/**", '!<rootDir>/src/**/I*.ts', '!<rootDir>/src/**/index.ts'],
  "coverageProvider": "babel",
  "coverageDirectory": "coverage",
  "testEnvironment": "node",
  "transform": {
    ".+\\.ts$": "@swc/jest"
  }
}

module.exports = config;