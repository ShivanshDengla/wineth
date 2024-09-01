import { PROVIDER_OP } from '../wagmi'; // Assuming this is where your provider is defined
import { ABI } from '../constants/abi';
import { ADDRESS } from '../constants/address';

export const getUser = async (userAddress: string) => {
  const usdcContract = {
    address: ADDRESS.USDC,
    abi: ABI.USDC,
  } as const;

  const usdcVaultContract = {
    address: ADDRESS.USDCVAULT,
    abi: ABI.USDCVAULT,
  } as const;

  try {
    const results = await PROVIDER_OP.multicall({
      contracts: [
        {
          ...usdcContract,
          functionName: 'balanceOf',
          args: [userAddress],
        },
        {
          ...usdcContract,
          functionName: 'allowance',
          args: [userAddress, usdcVaultContract.address],
        },
        {
          ...usdcVaultContract,
          functionName: 'balanceOf',
          args: [userAddress],
        },
      ],
    });

    const userDepositTokens = results[0].result.toString();
    const userAllowance = results[1].result.toString();
    const userVaultTokens = results[2].result.toString();

    return {
      UserDepositTokens: userDepositTokens,
      UserAllowance: userAllowance,
      UserVaultTokens: userVaultTokens,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
};
