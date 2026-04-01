import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

import './index.css'

//mantime components
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import {MantineProvider} from "@mantine/core";
import {theme} from "./theme/theme.ts";


//Клиент для управления запросами
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, 
            retry: 1,
        },
    },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <MantineProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </QueryClientProvider>
      </MantineProvider>
  </StrictMode>,
)
