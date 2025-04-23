import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/globals.css";
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import sdk from './services/dataplatform/sdk';
import { AuthProvider } from './contexts/dataplatform/AuthContext';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import './i18n';

const queryClient = new QueryClient()

sdk.start().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
})