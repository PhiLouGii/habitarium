module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: [
    'dotenv/config',
    '<rootDir>/jest.polyfills.js'
  ],
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
    '^firebase/firestore$': '<rootDir>/__mocks__/firebase/firestore.js',
    '^@/firebase$': '<rootDir>/src/__mocks__/firebase.ts',
    '^src/firebase$': '<rootDir>/src/__mocks__/firebase.ts',
    '^../firebase$': '<rootDir>/src/__mocks__/firebase.ts',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-calendar|firebase|@firebase)/)'
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
}