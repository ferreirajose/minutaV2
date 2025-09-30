import type { Config } from 'jest'

const jestConfig: Config = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@interface/(.*)$': '<rootDir>/interface/$1',
  },
}

export default jestConfig