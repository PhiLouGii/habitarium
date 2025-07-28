/// <reference lib="dom" />

import '@testing-library/jest-dom';

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

// Extend globalThis with TextEncoder/TextDecoder if missing
declare global {
  var TextEncoder: typeof globalThis.TextEncoder;
  var TextDecoder: typeof globalThis.TextDecoder;
}

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = PolyfillTextEncoder as unknown as typeof TextEncoder;
}

if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = PolyfillTextDecoder as unknown as typeof TextDecoder;
}
