import { Abi } from 'viem';
import PRIZEPOOL_ABI from './abis/prizepool.json';

export const ABI = {
  PRIZEPOOL: PRIZEPOOL_ABI as Abi,
  WETHPRIZE: PRIZEPOOL_ABI as Abi,
  USDCVAULT: PRIZEPOOL_ABI as Abi,
  DEPOSITTOKEN: PRIZEPOOL_ABI as Abi,
};