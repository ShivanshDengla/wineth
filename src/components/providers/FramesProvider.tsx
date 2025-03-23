'use client';

import { createConfig, http, WagmiProvider } from 'wagmi';
import { optimism, base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { frameConnector } from '../../lib/connector';
import { ADDRESS } from '../../constants/address';

// Use the chains from your existing config
export const framesConfig = createConfig({
  chains: [optimism, base],
  transports: {
    [optimism.id]: http(ADDRESS.RPCURL),
    [base.id]: http(),
  },
  connectors: [frameConnector()],
});

const queryClient = new QueryClient();

export default function FramesProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={framesConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
} 