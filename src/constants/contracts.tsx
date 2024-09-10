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
    address: ADDRESS.PRIZETOKEN.ADDRESS,
    abi: ABI.WETHPRIZE,
    client: PROVIDER_OP,
  }),
  USDCVAULT: getContract({
    address: ADDRESS.VAULT.ADDRESS,
    abi: ABI.USDCVAULT,
    client: PROVIDER_OP,
  }),
  USDC: getContract({
    address: ADDRESS.USDC,
    abi: ABI.USDC,
    client: PROVIDER_OP,
  }),
  TWABREWARDS: getContract({
    address: ADDRESS.TWABREWARDS,
    abi: ABI.TWABREWARDS,
    client: PROVIDER_OP,
  }),
};