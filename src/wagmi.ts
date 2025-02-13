import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { optimism, base } from 'wagmi/chains';
import { createPublicClient, http } from 'viem';
import { ADDRESS } from './constants/address'

if (!process.env.NEXT_PUBLIC_WALLET_CONNECT) {
  throw new Error('Missing NEXT_PUBLIC_WALLET_CONNECT environment variable')
}

export const PROVIDER = createPublicClient({
  chain: base,
  transport: http(ADDRESS.RPCURL),
});

export const config = getDefaultConfig({
  appName: 'WinWin',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT,
  chains: [
    optimism,
    // base
  ],
  ssr: true, // Since you're using Next.js
})