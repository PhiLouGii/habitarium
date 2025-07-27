// setupTests.ts
import '@testing-library/jest-dom';

/// <reference lib="dom" />

class PolyfillTextEncoder {
  encode(str: string): Uint8Array {
    const buf = new ArrayBuffer(str.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < str.length; i++) {
      view[i] = str.charCodeAt(i);
    }
    return view;
  }
}

class PolyfillTextDecoder {
  decode(data: Uint8Array): string {
    let str = '';
    for (let i = 0; i < data.length; i++) {
      str += String.fromCharCode(data[i]);
    }
    return str;
  }
}

// Use globalThis to support Node, jsdom, or browser environments
if (typeof (globalThis as any).TextEncoder === 'undefined') {
  (globalThis as any).TextEncoder = PolyfillTextEncoder;
}

if (typeof (globalThis as any).TextDecoder === 'undefined') {
  (globalThis as any).TextDecoder = PolyfillTextDecoder;
}
