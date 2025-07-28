module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        useESM: true,
      }
    ],
    '^.+\\.(js|jsx)$': 'babel-jest' 
  },
  testMatch: ['**/__tests__/**/*.test.tsx'],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    '^firebase/app$': '<rootDir>/__mocks__/firebase/app.js',
    '^firebase/auth$': '<rootDir>/__mocks__/firebase/auth.js',
    '^firebase/firestore$': '<rootDir>/__mocks__/firebase/firestore.js'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-calendar|firebase|@firebase)/)' 
  ],

  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};