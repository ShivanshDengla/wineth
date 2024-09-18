// pages/index.tsx
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Tvl from '../components/Tvl';
import Prizes from '../components/Prizes';
import UserBalances from '../components/UserBalances';
import Rewards from '../components/Rewards';
import PrizesWon from '../components/prizesWon';
import Chance from '../components/Chance'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Prize Pool Contract</title>
        <meta content="Prize Pool Contract Information" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ConnectButton showBalance={false}/>
        <Prizes />
        <Tvl />
        <UserBalances />
        <Rewards />
        <PrizesWon />
        <Chance />
      </main>
    </div>
  );
};

export default Home;
