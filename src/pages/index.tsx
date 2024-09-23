// pages/index.tsx
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Tvl from '../components/Tvl';
import Prizes from '../components/Prizes';
import UserBalances from '../components/UserBalances';
import Rewards from '../components/Rewards';
import PrizesWon from '../components/PrizesWon';
import Chance from '../components/Chance'
import Image from 'next/image';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Prize Pool Contract</title>
        <meta content="Prize Pool Contract Information" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className="flex flex-col items-center justify-center h-full">
      <div className="absolute top-5 left-5">
          <Image
            src="/images/logo.svg"
            height={90}
            width={90}
            alt="Win Win"
          />
        </div>
        <div className="absolute top-5 right-5">
          <ConnectButton showBalance={false} />
        </div>
        <div className="flex items-center justify-center gap-10 mt-8 w-full">
          <Prizes />
          <Rewards />
        </div>
        <Tvl />
        {/* <UserBalances /> 
        <PrizesWon />
        <Chance /> */}
      </main>
    </div>
  );
};

export default Home;
