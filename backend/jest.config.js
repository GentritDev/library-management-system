module.exports = {
    testEnvironment : 'node',
    coveragePathIgnorePatterns: ['/node_modules/'],
    testMatch : ['**/__tests__/**/*.test.js'],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
};