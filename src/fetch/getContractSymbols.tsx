import { CONTRACTS } from '../constants/contracts';

export const getContractSymbols = async () => {
  try {
    const vaultName = await CONTRACTS.VAULT.read.name();
    console.log("Vault Name:", vaultName); // Add this log
    return {
      vaultName,
    };
  } catch (error: any) {
    console.error(error); // Log the full error
    throw new Error(`Failed to fetch contract info: ${error.message}`);
  }
};
