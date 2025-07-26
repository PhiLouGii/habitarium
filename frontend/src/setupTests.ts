import '@testing-library/jest-dom';

// Extend global object with TextEncoder/TextDecoder
declare global {
  var TextEncoder: {
    new (): TextEncoder;
    prototype: TextEncoder;
  };
  var TextDecoder: {
    new (label?: string, options?: TextDecoderOptions): TextDecoder;
    prototype: TextDecoder;
  };
}

// Polyfill for TextEncoder/TextDecoder
if (typeof window.TextEncoder === 'undefined') {
  window.TextEncoder = class {
    constructor() {}
    encode(str: string) {
      const buf = new ArrayBuffer(str.length);
      const bufView = new Uint8Array(buf);
      for (let i = 0; i < str.length; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return bufView;
    }
  } as never;
}

if (typeof window.TextDecoder === 'undefined') {
  window.TextDecoder = class {
    constructor(public label?: string, public options?: TextDecoderOptions) {}
    decode(data: Uint8Array) {
      let str = '';
      for (let i = 0; i < data.length; i++) {
        str += String.fromCharCode(data[i]);
      }
      return str;
    }
  } as never;
}