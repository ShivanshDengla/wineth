import { PROVIDER_OP } from '../wagmi'; // Assuming this is where your provider is defined
import { ABI } from '../constants/abi';
import { ADDRESS } from '../constants/address';

export async function getPrizes() {
  const prizePoolContract = {
    address: ADDRESS.PRIZEPOOL,
    abi: ABI.PRIZEPOOL,
  } as const;

  try {
    const results = await PROVIDER_OP.multicall({
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

    const accountedBalance = results[0].result;
    const grandPrizeLiquidity = results[1].result;
    return { accountedBalance, grandPrizeLiquidity };
  } catch (error) {
    console.error('Error fetching prize pool data:', error);
    return { accountedBalance: null, tierRemainingLiquidity: null };
  }
}