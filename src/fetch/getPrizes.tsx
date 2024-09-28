import { PROVIDER } from '../wagmi'; // Assuming this is where your provider is defined
import { ABI } from '../constants/abi';
import { ADDRESS } from '../constants/address';

export interface PrizeData {
  accountedBalance: bigint | null;
  grandPrizeLiquidity: bigint | null;
}

export async function getPrizes(): Promise<PrizeData> {
  const prizePoolContract = {
    address: ADDRESS.PRIZEPOOL,
    abi: ABI.PRIZEPOOL,
  } as const;

  try {
    const results = await PROVIDER.multicall({
      contracts: [
        {
          ...prizePoolContract,
          functionName: 'accountedBalance',
        },
        {
          ...prizePoolContract,
          functionName: 'getTierRemainingLiquidity',
          args: [0], // Assuming tier 0
        },
      ],
    });

    const accountedBalance: bigint = results[0].result as bigint;
    const grandPrizeLiquidity: bigint = results[1].result as bigint;

    return { accountedBalance, grandPrizeLiquidity };
  } catch (error) {
    console.error('Error fetching prize pool data:', error);
    return { accountedBalance: null, grandPrizeLiquidity: null };
  }
}
