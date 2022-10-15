const config = {
  "roots": ["<rootDir>/src"],
  "clearMocks": true,
  "collectCoverageFrom": ["<rootDir>/src/**/*.ts", "!<rootDir>/src/main/**", '!<rootDir>/src/**/I*.ts', '!<rootDir>/src/**/index.ts'],
  "coverageDirectory": "coverage",
  "testEnvironment": "node",
  "transform": {
    ".+\\.ts$": "ts-jest"
  }
}

module.exports = config;