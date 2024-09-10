import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { optimism, base } from 'wagmi/chains';
import { createPublicClient, http } from 'viem';

export const PROVIDER = createPublicClient({
  chain: base,
  transport: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
});

const WALLET_CONNECT_KEY = process.env.WALLET_CONNECT || "default_project_id";

export const config = getDefaultConfig({
  appName: 'WinWin',
  projectId: WALLET_CONNECT_KEY,
  chains: [
    // optimism, 
    base
  ],
  ssr: true,
})