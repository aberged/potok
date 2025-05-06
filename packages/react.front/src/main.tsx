import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ZenStackHooksProvider } from './zenstack/tanstack/hooks';
import App from './app/app';
import { FetchFn } from '@zenstackhq/tanstack-query/runtime-v5';

const queryClient = new QueryClient();

const potokFetch: FetchFn = (url, options) => {
  options = options ?? {};
  options.headers = {
      ...options.headers,
      'x-user-id': '1',
  };
  return fetch(url, options);
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ZenStackHooksProvider value={{ endpoint: 'http://localhost:3000/api/rpc', fetch: potokFetch }}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ZenStackHooksProvider>
    </QueryClientProvider>
  </StrictMode>
);
