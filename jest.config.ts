import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: false,
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '\\.(icc|ttf)$': '<rootDir>/jest-config/jest.assetTransformer.cjs'
    },
    transformIgnorePatterns: ['/node_modules/(?!pdf-lib|other-relevant-module)']
};
export default config;
