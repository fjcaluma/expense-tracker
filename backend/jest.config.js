module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    globalTeardown: '<rootDir>/tests/teardown.ts',
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.test.ts'
    ],
    coverageDirectory: 'coverage',
    testTimeout: 10000
};