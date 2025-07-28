export default {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^firebase/app$': '<rootDir>/__mocks__/firebase.js',
    '^firebase/auth$': '<rootDir>/__mocks__/firebase-auth.js',
    '^firebase/firestore$': '<rootDir>/__mocks__/firebase-firestore.js'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { 
      useESM: true,
      isolatedModules: true,
      tsconfig: 'tsconfig.json'
    }],
    '^.+\\.mjs$': 'babel-jest'
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-calendar|firebase|@firebase)/)'
  ],
  testMatch: ['**/__tests__/**/*.test.tsx'],
  testTimeout: 30000,
};
