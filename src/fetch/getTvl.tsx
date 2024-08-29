import { CONTRACTS } from '../constants/contracts';

export const getTvl = async () => {
  try {
    const totalAssets = await CONTRACTS.USDCVAULT.read.totalAssets();
    return totalAssets;
  } catch (error: any) {
    throw new Error(`Failed to fetch Total Value Locked (TVL): ${error.message}`);
  }
};
