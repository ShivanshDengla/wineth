import { PROVIDER } from '../wagmi'; // Assuming this is where your provider is defined
import { ABI } from '../constants/abi';
import { ADDRESS } from '../constants/address';

export interface UserData {
  UserDepositTokens: bigint;
  UserAllowance: bigint;
  UserVaultTokens: bigint;
}

export const getUser = async (userAddress: string) => {
  const usdcContract = {
    address: ADDRESS.DEPOSITTOKEN.ADDRESS,
    abi: ABI.USDC,
  } as const;

  const usdcVaultContract = {
    address: ADDRESS.VAULT.ADDRESS,
    abi: ABI.USDCVAULT,
  } as const;

  try {
    const results = await PROVIDER.multicall({
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

    const userDepositTokens = results[0].result as bigint;
    const userAllowance = results[1].result as bigint;
    const userVaultTokens = results[2].result as bigint;
// console.log("user deposit tokens", userDepositTokens.toString());
// console.log("user address", userAddress);

    return {
      UserDepositTokens: userDepositTokens,
      UserAllowance: userAllowance,
      UserVaultTokens: userVaultTokens,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
};
