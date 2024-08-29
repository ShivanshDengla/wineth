import { CONTRACTS } from '../constants/contracts';

export const getContractSymbols = async () => {
  try {

    // Fetch symbols and names using the `read` method
    const vaultName = await CONTRACTS.USDCVAULT.read.name();

    return {
      vaultName,
    };
  } catch (error) {
    throw new Error(`Failed to fetch contract info: ${error.message}`);
  }
};
