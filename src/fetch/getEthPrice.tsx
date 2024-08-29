// fetch/getEthPrice.ts

export const getEthPrice = async (): Promise<number> => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await response.json();
      return data.ethereum.usd;
    } catch (error) {
      throw new Error('Failed to fetch ETH price');
    }
  };
  