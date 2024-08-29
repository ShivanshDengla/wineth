import { CONTRACTS } from '../constants/contracts';

export const getUser = async (userAddress: string) => {
  try {
    // Fetch user deposit tokens from the USDC contract
    const userDepositTokens = await CONTRACTS.USDC.read.balanceOf([userAddress]);
    const userDepositTokensString = userDepositTokens.toString();

    // Fetch user allowance for the vault
    const userAllowance = await CONTRACTS.USDC.read.allowance([userAddress, CONTRACTS.USDCVAULT.address]);
    const userAllowanceString = userAllowance.toString();

    // Fetch user vault tokens from the vault contract
    const userVaultTokens = await CONTRACTS.USDCVAULT.read.balanceOf([userAddress]);
    const userVaultTokensString = userVaultTokens.toString();

    return {
      UserDepositTokens: userDepositTokensString,
      UserAllowance: userAllowanceString,
      UserVaultTokens: userVaultTokensString,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
};
