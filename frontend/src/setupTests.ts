import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Extend global object with TextEncoder/TextDecoder
declare global {
  var TextEncoder: typeof TextEncoder;
  var TextDecoder: typeof TextDecoder;
}

// Assign polyfills
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;