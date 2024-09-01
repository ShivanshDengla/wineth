// components/Prizes.tsx
import { useEffect, useState } from 'react';
import { getPrizes } from '../fetch/getPrizes';

const Prizes = () => {
  const [data, setData] = useState<{ accountedBalance: string | null, grandPrizeLiquidity: string | null }>({
    accountedBalance: null,
    grandPrizeLiquidity: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const prizeData = await getPrizes();
        setData(prizeData);
      } catch (err: any) {
        setError(`Failed to fetch prize data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPrizes();
  }, []);

  const formatToEth = (value: string | null) => {
    if (value === null) return 'N/A';
    return (parseFloat(value) / 1e18).toFixed(4);
  };

  const calculateUsdValue = (ethAmount: string | null, ethPrice: number | null) => {
    if (ethAmount === null || ethPrice === null) return 'N/A';
    const ethValue = parseFloat(ethAmount) / 1e18;
    return (ethValue * ethPrice).toFixed(2);
  };

  if (loading) return <div>Loading Prizes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Accounted Balance: {formatToEth(data.accountedBalance)} ETH</p>
      <p>Tier 0 Remaining Liquidity: {formatToEth(data.grandPrizeLiquidity)} ETH</p>
    </div>
  );
};

export default Prizes;
