import '@testing-library/jest-dom';

// Simple TextEncoder polyfill
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = class {
    encode(str: string) {
      const bytes = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
      }
      return bytes;
    }
  } as any;
}

// Simple TextDecoder polyfill
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = class {
    decode(data: Uint8Array) {
      let str = '';
      for (let i = 0; i < data.length; i++) {
        str += String.fromCharCode(data[i]);
      }
      return str;
    }
  } as any;
}