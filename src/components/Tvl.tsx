// components/Tvl.tsx
import { useEffect, useState } from 'react';
import { getTvl } from '../fetch/getTvl';
import { getTokenPrice } from '../fetch/getTokenPrice';

const Tvl = () => {
  const [tvl, setTvl] = useState<string | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch TVL data
        const tvlData = await getTvl();
        setTvl(tvlData);

        // Fetch Ethereum price
        const ethPriceData = await getTokenPrice('ethereum');
        setEthPrice(ethPriceData);
      } catch (err: any) {
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Total Value Locked (TVL): {tvl || 'N/A'} USDC</p>
      <p>Ethereum Price: {ethPrice ? `$${ethPrice.toFixed(2)}` : 'N/A'}</p>
    </div>
  );
};

export default Tvl;
