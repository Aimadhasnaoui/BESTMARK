import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@mui/material/styles';
import theme from './lib/mui-theme';
import CssBaseline from '@mui/material/CssBaseline';
import { DataProvider } from "./Component/Data/contextApi"
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DataProvider>
        <App />
        </DataProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              style: {
                background: '#059669', // Emerald 600
              },
            },
            error: {
              style: {
                background: '#dc2626', // Red 600
              },
            },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
