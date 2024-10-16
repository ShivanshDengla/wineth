import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { optimism, base } from 'wagmi/chains';
import { createPublicClient, http } from 'viem';
import { ADDRESS } from './constants/address'

export const PROVIDER = createPublicClient({
  chain: base,
  transport: http(ADDRESS.RPCURL),
});

const WALLET_CONNECT_KEY = process.env.WALLET_CONNECT || "default_project_id";

export const config = getDefaultConfig({
  appName: 'WinWin',
  projectId: WALLET_CONNECT_KEY,
  chains: [
    optimism, 
    // base
  ],
  ssr: true,
})