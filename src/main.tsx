// 👇 EXTREME TOP PATCH: Intercept and discard Vite's proxy network failures before they boot
if (typeof window !== 'undefined') {
  const originalError = window.console.error;
  window.console.error = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('[vite] failed to connect to websocket')) {
      return; 
    }
    originalError.apply(window, args);
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && event.reason.message.includes('WebSocket closed without opened')) {
      event.preventDefault(); 
      event.stopPropagation();
    }
  });
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
