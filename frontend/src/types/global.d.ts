/// <reference types="@testing-library/jest-dom" />

declare namespace jest {
  interface Matchers<R> {
    toHaveClass(className: string): R; // Changed parameter name
  }
}

// These declarations are no longer needed with @types/jest
// Remove these lines:
// declare var jest: any;
// declare var describe: any;
// declare var test: any;
// declare var expect: any;