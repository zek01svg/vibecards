import type { Config } from "jest";

const jestConfig: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  // Ignore Playwright tests in tests/e2e
  testPathIgnorePatterns: ["/node_modules/", "/tests/e2e/"],
  // Setup files if needed
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    // Handle CSS imports (without CSS modules)
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    // Handle image imports
    "^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$":
      "<rootDir>/__mocks__/fileMock.js",
    // Handle alias
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default jestConfig;
