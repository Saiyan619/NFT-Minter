import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { http, createConfig } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';

// My wagmi config

// Define the chains you want to support
const chains = [mainnet, sepolia];

// Create http transports
const transports = {
  [mainnet.id]: http(
    `https://mainnet.infura.io/v3/${import.meta.env.VITE_PUBLIC_RPC_URL}`
  ),
  [sepolia.id]: http(
    `https://sepolia.infura.io/v3/${import.meta.env.VITE_PUBLIC_RPC_URL}`
  ),
  // Fallback to public transport for other chains
  fallback: http(),
};

 // Set up connectors
const { connectors } = getDefaultWallets({
  appName: "NFT-MINT",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains
})
 
// // Create wagmi config
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports,
  connectors,
});
