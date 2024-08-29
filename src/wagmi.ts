import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { optimism } from 'wagmi/chains';
import { createPublicClient, http } from 'viem';

export const PROVIDER_OP = createPublicClient({
  chain: optimism,
  transport: http(`https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
});

const WALLET_CONNECT_KEY = process.env.WALLET_CONNECT || "default_project_id";

export const config = getDefaultConfig({
  appName: 'WinWin',
  projectId: WALLET_CONNECT_KEY,
  chains: [
    optimism,
  ],
  ssr: true,
})