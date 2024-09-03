// fetch/getTokenPrice.ts

export const getTokenPrice = async (tokenId: string): Promise<number> => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`
    );
    const data = await response.json();
    return data[tokenId]?.usd || 0;
  } catch (error) {
    throw new Error(`Failed to fetch price for ${tokenId}`);
  }
};
