import '@testing-library/jest-dom';

// Mock global objects for Jest
global.afterEach(() => {
  jest.clearAllMocks();
});

global.beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});