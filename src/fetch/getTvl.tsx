import { CONTRACTS } from '../constants/contracts';

export const getTvl = async () => {
  try {
    const totalAssets = await CONTRACTS.USDCVAULT.read.totalAssets();
    const totalAssetsString = totalAssets.toString();
    return totalAssetsString;
  } catch (error: any) {
    console.error("Error fetching TVL:", error); // Log the full error
    throw new Error(`Failed to fetch Total Value Locked (TVL): ${error.message}`);
  }
};
