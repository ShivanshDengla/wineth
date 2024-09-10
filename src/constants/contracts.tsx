import { getContract } from 'viem';
import { PROVIDER } from '../wagmi';
import { ADDRESS } from './address';
import { ABI } from './abi';


export const CONTRACTS = {
  PRIZEPOOL: getContract({
    address: ADDRESS.PRIZEPOOL,
    abi: ABI.PRIZEPOOL,
    client: PROVIDER,
  }),
  WETHPRIZE: getContract({
    address: ADDRESS.PRIZETOKEN.ADDRESS,
    abi: ABI.WETHPRIZE,
    client: PROVIDER,
  }),
  USDCVAULT: getContract({
    address: ADDRESS.VAULT.ADDRESS,
    abi: ABI.USDCVAULT,
    client: PROVIDER,
  }),
  USDC: getContract({
    address: ADDRESS.USDC,
    abi: ABI.USDC,
    client: PROVIDER,
  }),
  TWABREWARDS: getContract({
    address: ADDRESS.TWABREWARDS,
    abi: ABI.TWABREWARDS,
    client: PROVIDER,
  }),
};