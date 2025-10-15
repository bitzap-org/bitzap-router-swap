import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Buffer } from 'buffer'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { TooltipProvider } from '@/components/ui/tooltip'
import { WagmiProvider } from 'wagmi'
import { config } from './wagmi'
import './index.css'
import App from './App'
import { Toaster } from './components/ui/toast'

globalThis.Buffer = Buffer

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={0}>
        <App />
        <Toaster richColors position="top-center" />
      </TooltipProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
