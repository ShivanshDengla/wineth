import { CONTRACTS } from '../constants/contracts';

export const getContractSymbols = async () => {
  try {

    // Fetch symbols and names using the `read` method
    const vaultName = await CONTRACTS.USDCVAULT.read.name();
    const vaultTotalAssets = await CONTRACTS.USDCVAULT.read.totalAssets();
    const USDCName = await CONTRACTS.USDC.read.name();

    return {
      vaultName,
      vaultTotalAssets,
      USDCName,
    };
  } catch (error) {
    throw new Error(`Failed to fetch contract info: ${error.message}`);
  }
};
