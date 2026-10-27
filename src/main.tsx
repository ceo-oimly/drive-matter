// Ensure window.fetch has both getter and setter for third-party interceptors
if (typeof window !== 'undefined') {
  try {
    const orig = window.fetch ? window.fetch.bind(window) : undefined;
    let customFetch = orig;
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (!desc || desc.configurable) {
      Object.defineProperty(window, 'fetch', {
        get() {
          return customFetch;
        },
        set(fn) {
          customFetch = fn;
        },
        configurable: true,
        enumerable: true
      });
    }
  } catch (_e) {}
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
