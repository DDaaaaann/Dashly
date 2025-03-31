import type {JestConfigWithTsJest} from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/unit'],
  extensionsToTreatAsEsm: ['.ts'],
};

export default config;