// pages/test.tsx

import { useEffect, useState } from 'react';
import { getPrizes } from '../fetch/getPrizes';
import { getEthPrice } from '../fetch/getEthPrice';
import { getContractSymbols } from '../fetch/getContractSymbols';
import { getTvl } from '../fetch/getTvl';
import { getUser } from '../fetch/getUser';

const PrizePoolPage = () => {
  const userAddress = '0x15E9Bc2BEBcCF1FFB4b955655A7666F509e66DBE'; // remove later

  const [data, setData] = useState<{ accountedBalance: string | null, grandPrizeLiquidity: string | null }>({
    accountedBalance: null,
    grandPrizeLiquidity: null,
  });
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [contractSymbols, setContractSymbols] = useState<{ vaultName: string | null }>({ vaultName: null });
  const [tvl, setTvl] = useState<string | null>(null);
  const [userData, setUserData] = useState<{
    UserDepositTokens: string;
    UserAllowance: string;
    UserVaultTokens: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prizePoolData, ethPrice, contractSymbols, tvl, userData] = await Promise.all([
          getPrizes(),
          getEthPrice(),
          getContractSymbols(),
          getTvl(),
          getUser(userAddress), // Pass the hardcoded userAddress
        ]);
        setData(prizePoolData);
        setEthPrice(ethPrice);
        setContractSymbols(contractSymbols);
        setTvl(tvl);
        setUserData(userData);
      } catch (err: any) {
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userAddress]); // Dependency array includes userAddress

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
      <p>Contract Vault Name: {contractSymbols.vaultName || 'N/A'}</p>
      <p>Total Value Locked (TVL): {tvl || 'N/A'} USDC</p>
      <h2>User Data</h2>
      <p>User Deposit Tokens: {userData?.UserDepositTokens || 'N/A'} USDC</p>
      <p>User Allowance: {userData?.UserAllowance || 'N/A'} USDC</p>
      <p>User Vault Tokens: {userData?.UserVaultTokens || 'N/A'}</p>
    </div>
  );
};

export default PrizePoolPage;
