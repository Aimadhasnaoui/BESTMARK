import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import { Toaster } from "@/components/ui/sonner"
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
        <Toaster position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
