/// <reference types="vite/client" />

declare global {
  interface Window {
    global: typeof globalThis
  }
}

// Fix for global in Vite
window.global = window.global ?? window