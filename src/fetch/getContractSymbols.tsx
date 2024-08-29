import { getContract } from 'viem';
import { PROVIDER_OP } from '../wagmi';
import { ABI } from '../constants/abi';
import { ADDRESS } from '../constants/address';
import { CONTRACTS } from '../constants/contracts';

export const getContractSymbols = async () => {
  try {

    // Fetch symbols and names using the `read` method
    const vaultName = await CONTRACTS.USDCVAULT.read.name();
    const vaultTotalAssets = await CONTRACTS.USDCVAULT.read.totalAssets();
    const depositTokenName = await CONTRACTS.DEPOSITTOKEN.read.name();

    return {
      vaultName,
      vaultTotalAssets,
      depositTokenName,
    };
  } catch (error) {
    throw new Error(`Failed to fetch contract info: ${error.message}`);
  }
};
