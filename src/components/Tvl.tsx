// components/Tvl.tsx
import { useEffect, useState } from 'react';
import { getTvl } from '../fetch/getTvl';

const Tvl = () => {
  const [tvl, setTvl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTvl = async () => {
      try {
        const tvlData = await getTvl();
        setTvl(tvlData);
      } catch (err: any) {
        setError(`Failed to fetch TVL data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTvl();
  }, []);

  if (loading) return <div>Loading TVL...</div>;
  if (error) return <div>Error: {error}</div>;

  return <p>Total Value Locked (TVL): {tvl || 'N/A'} USDC</p>;
};

export default Tvl;
