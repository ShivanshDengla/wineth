// pages/test.tsx

import { useEffect, useState } from 'react';
import { getPrizes } from '../fetch/getPrizes';
import { getEthPrice } from '../fetch/getEthPrice';

const PrizePoolPage = () => {
  const [data, setData] = useState<{ accountedBalance: string | null, grandPrizeLiquidity: string | null }>({
    accountedBalance: null,
    grandPrizeLiquidity: null,
  });
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prizePoolData, ethPrice] = await Promise.all([getPrizes(), getEthPrice()]);
        setData(prizePoolData);
        setEthPrice(ethPrice);
      } catch (err) {
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatToEth = (value: string | null) => {
    if (value === null) return 'N/A';
    return (parseFloat(value) / 1e18).toFixed(4); // Convert to ETH and format to 4 decimal places
  };

  const calculateUsdValue = (ethAmount: string | null) => {
    if (ethAmount === null || ethPrice === null) return 'N/A';
    const ethValue = parseFloat(ethAmount) / 1e18;
    return (ethValue * ethPrice).toFixed(2); // Convert to USD and format to 2 decimal places
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Prize Pool Contract</h1>
      <p>Accounted Balance: {formatToEth(data.accountedBalance)} ETH</p>
      <p>Accounted Balance: ${calculateUsdValue(data.accountedBalance)}</p>
      <p>Tier 0 Remaining Liquidity: {formatToEth(data.grandPrizeLiquidity)} ETH</p>
      <p>Tier 0 Remaining Liquidity: ${calculateUsdValue(data.grandPrizeLiquidity)}</p>
    </div>
  );
};

export default PrizePoolPage;