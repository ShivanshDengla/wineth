import { Address } from 'viem';

interface TokenInfo {
    ADDRESS: Address;
    SYMBOL: string;
    DECIMALS: number;
    ICON: string;
  }
  
  interface AddressMap {
    CHAINNAME: string;
    RPCURL: string;
    CHAINID: number;
    PRIZEPOOL: Address;
    PRIZETOKEN: TokenInfo;
    DEPOSITTOKEN: TokenInfo;
    VAULT: TokenInfo;
    USDC: Address;
    TWABREWARDS: Address;
    PRIZEPOOLSUBGRAPH: string;
    BLOCKEXPLORER: string;
    
  }

// op usdc
/*
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
  */
 // base usdc
  export const ADDRESS: AddressMap = {
    CHAINNAME: "Base",
    CHAINID: 8453,
    RPCURL: process.env.NEXT_PUBLIC_GROVE_KEY ? `https://base-mainnet.rpc.grove.city/v1/${process.env.NEXT_PUBLIC_GROVE_KEY}` : 
    `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
    PRIZEPOOL: '0x45b2010d8a4f08b53c9fa7544c51dfd9733732cb',
    PRIZETOKEN: {
      ADDRESS: '0x4200000000000000000000000000000000000006',
      SYMBOL: 'WETH',
      DECIMALS: 18,
      // ICON: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      ICON: '/images/eth.jpg'
    },
    VAULT: {
      ADDRESS: '0x7f5c2b379b88499ac2b997db583f8079503f25b9',
      SYMBOL: 'przUSDC',
      DECIMALS: 6,
      ICON: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389',
    },
    DEPOSITTOKEN: {
      ADDRESS: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      SYMBOL: 'USDC',
      DECIMALS: 6,
      ICON: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389',
    },    
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    TWABREWARDS: '0x86f0923d20810441efc593eb0f2825c6bff2dc09',
    PRIZEPOOLSUBGRAPH: "https://api.studio.thegraph.com/query/41211/pt-v5-base/version/latest",
    BLOCKEXPLORER: "https://basescan.org"
  };