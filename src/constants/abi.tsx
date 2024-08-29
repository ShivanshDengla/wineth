import { Abi } from 'viem';
import PRIZEPOOL_ABI from './abis/prizepool.json';
import USDCVAULT_ABI from './abis/usdcvault.json';
import DEPOISTTOKEN_ABI from './abis/deposittoken.json';
import WETHPRIZE_ABI from './abis/wethprize.json';

export const ABI = {
  PRIZEPOOL: PRIZEPOOL_ABI as Abi,
  WETHPRIZE: USDCVAULT_ABI as Abi,
  USDCVAULT: DEPOISTTOKEN_ABI as Abi,
  DEPOSITTOKEN: WETHPRIZE_ABI as Abi,
};