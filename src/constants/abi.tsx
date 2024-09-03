import { Abi } from 'viem';
import PRIZEPOOL_ABI from './abis/prizepool.json';
import USDCVAULT_ABI from './abis/usdcvault.json';
import USDC_ABI from './abis/usdc.json';
import WETHPRIZE_ABI from './abis/wethprize.json';
import TWABREWARDS_ABI from './abis/twabrewards.json'

export const ABI = {
  PRIZEPOOL: PRIZEPOOL_ABI as Abi,
  WETHPRIZE: WETHPRIZE_ABI as Abi,
  USDCVAULT: USDCVAULT_ABI as Abi,
  USDC: USDC_ABI as Abi,
  TWABREWARDS: TWABREWARDS_ABI as Abi,
};