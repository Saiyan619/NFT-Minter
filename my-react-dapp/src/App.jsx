import React from "react"
import { WagmiProvider } from "wagmi"
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from "./utils/wagmiConfig"
import WalletConnect from "./components/WalletConnect"
import Home from "./homepage/Home";

function App() {

  // client for TanStack Query
const queryClient = new QueryClient();

  
  return (
    <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
          <div className="app">
            <h1>Web3 Application</h1>
          <Home />
          </div>
        </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App