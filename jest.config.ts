import type { Config } from "jest";

const jestConfig: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@interface/(.*)$": "<rootDir>/interface/$1",
  },
};

export default jestConfig;
