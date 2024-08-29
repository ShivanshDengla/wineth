import { getContract } from 'viem';
import { PROVIDER_OP } from '../wagmi';
import { ADDRESS } from './address';
import { ABI } from './abi';


export const CONTRACTS = {
  PRIZEPOOL: getContract({
    address: ADDRESS.PRIZEPOOL,
    abi: ABI.PRIZEPOOL,
    client: PROVIDER_OP,
  }),
  WETHPRIZE: getContract({
    address: ADDRESS.WETHPRIZE,
    abi: ABI.WETHPRIZE,
    client: PROVIDER_OP,
  }),
  USDCVAULT: getContract({
    address: ADDRESS.USDCVAULT,
    abi: ABI.USDCVAULT,
    client: PROVIDER_OP,
  }),
  DEPOSITTOKEN: getContract({
    address: ADDRESS.DEPOSITTOKEN,
    abi: ABI.DEPOSITTOKEN,
    client: PROVIDER_OP,
  }),
};