import { CONTRACTS } from '../constants/contracts';

export const getTvl = async () => {
  try {
    const totalAssets = await CONTRACTS.VAULT.read.totalAssets() as bigint;
    return totalAssets
  } catch (error: any) {
    console.error("Error fetching TVL:", error); // Log the full error
    throw new Error(`Failed to fetch Total Value Locked (TVL): ${error.message}`);
  }
};
