import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getPrizes } from '../fetch/getPrizes';
import { getEthPrice } from '../fetch/getEthPrice';
import { getContractSymbols } from '../fetch/getContractSymbols';
import { getTvl } from '../fetch/getTvl';
import { getUser } from '../fetch/getUser';

const Home: NextPage = () => {
  const { address } = useAccount();

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
      if (!address) return; 

      try {
        const [prizePoolData, ethPrice, contractSymbols, tvl, userData] = await Promise.all([
          getPrizes(),
          getEthPrice(),
          getContractSymbols(),
          getTvl(),
          getUser(address),
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
  }, [address]);

  const formatToEth = (value: string | null) => {
    if (value === null) return 'N/A';
    return (parseFloat(value) / 1e18).toFixed(4);
  };

  const calculateUsdValue = (ethAmount: string | null) => {
    if (ethAmount === null || ethPrice === null) return 'N/A';
    const ethValue = parseFloat(ethAmount) / 1e18;
    return (ethValue * ethPrice).toFixed(2);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Prize Pool Contract</title>
        <meta
          content="Prize Pool Contract Information"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
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
        )}
      </main>
    </div>
  );
};

export default Home;
