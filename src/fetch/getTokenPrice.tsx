// fetch/getTokenPrice.ts

interface CacheEntry {
  price: number;
  timestamp: number;
}

const priceCache: { [tokenId: string]: CacheEntry } = {};

export const getTokenPrice = async (tokenId: string): Promise<number> => {
  const cacheExpiry = 60 * 1000; // Cache expiry time: 60 seconds

  const currentTime = Date.now();
  const cachedEntry = priceCache[tokenId];

  // If the cached price exists and is still valid (within 60 seconds), return it
  if (cachedEntry && currentTime - cachedEntry.timestamp < cacheExpiry) {
    return cachedEntry.price;
  }

  try {
    // Fetch new price from the API
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`
    );
    const data = await response.json();
    const price = data[tokenId]?.usd || 0;

    // Cache the fetched price with the current timestamp
    priceCache[tokenId] = { price, timestamp: currentTime };

    return price;
  } catch (error) {
    throw new Error(`Failed to fetch price for ${tokenId}`);
  }
};
