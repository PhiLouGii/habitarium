export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
  },

  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  transformIgnorePatterns: [
    'node_modules/(?!(react-calendar)/)', 
  ],

  globals: {
    'ts-jest': {
      useESM: true,
    },
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
