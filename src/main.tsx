import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global HTTP Interceptor for user authentication context mapping
try {
  const originalFetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    value: async function (input: RequestInfo | URL, init?: RequestInit) {
      const sessionStr = localStorage.getItem("userSession");
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          if (session && session.email) {
            init = init || {};
            let headersList: Record<string, string> = {};
            if (init.headers) {
              if (init.headers instanceof Headers) {
                init.headers.forEach((v, k) => {
                  headersList[k] = v;
                });
              } else if (Array.isArray(init.headers)) {
                init.headers.forEach(([k, v]) => {
                  headersList[k] = v;
                });
              } else {
                headersList = { ...init.headers } as Record<string, string>;
              }
            }
            if (session.token) {
              headersList["Authorization"] = `Bearer ${session.token}`;
            }
            init.headers = headersList;
          }
        } catch (e) {
          console.warn("Failed to automatically attach secure session headers:", e);
        }
      }
      return originalFetch(input, init);
    },
    writable: true,
    configurable: true
  });
} catch (e) {
  console.warn("Direct window.fetch interception failed or read-only, falling back:", e);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
