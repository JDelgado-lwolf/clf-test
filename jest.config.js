const esModules = ['@helix', '@lwt-helix', '@terradatum'].join('|');

module.exports = {
    testEnvironment: 'jsdom',
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.testing.js' }]
    },
    testRegex: 'tests/.*\\.test.(js|jsx)$',
    moduleNameMapper: {
        '^.+\\.(css|less|sass|scss|jpg)$': '<rootDir>/config/CSSStub.js'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: ['/node_modules/', '/public/'],
    transformIgnorePatterns: [
        `//node_modules/(?!${esModules}/)`
    ],
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
    verbose: true,
    collectCoverage: false,
    collectCoverageFrom: ['src/**/*.*(js|jsx)']
};
