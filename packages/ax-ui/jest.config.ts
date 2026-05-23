import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tsconfig.json',
    }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/src/__mocks__/styleMock.ts',
  },
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  setupFilesAfterFramework: [],
  setupFiles: ['<rootDir>/src/__setup__/jest.setup.ts'],
};

export default config;
