import { Address } from 'viem';

interface TokenInfo {
    ADDRESS: Address;
    SYMBOL: string;
    DECIMALS: number;
  }
  
  interface AddressMap {
    PRIZEPOOL: Address;
    PRIZETOKEN: TokenInfo;
    VAULT: TokenInfo;
    USDC: Address;
    TWABREWARDS: Address;
  }
  
export const ADDRESS: AddressMap = {
    PRIZEPOOL: '0xF35fE10ffd0a9672d0095c435fd8767A7fe29B55',
    PRIZETOKEN: {
      ADDRESS: '0x4200000000000000000000000000000000000006',
      SYMBOL: 'WETH',
      DECIMALS: 18,
    },
    VAULT: {
      ADDRESS: '0x03d3ce84279cb6f54f5e6074ff0f8319d830dafe',
      SYMBOL: 'USDC',
      DECIMALS: 6,
    },
    USDC: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
    TWABREWARDS: '0x90D383dEA4dcE52D3e5D3C93dE75eF36da3Ea9Ea',
  };