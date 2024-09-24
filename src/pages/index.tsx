// pages/index.tsx
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Tvl from '../components/Tvl';
import Prizes from '../components/Prizes';
import UserBalancesAndChance from '../components/UserBalancesAndChance';
import Rewards from '../components/Rewards';
import PrizesWon from '../components/PrizesWon';
import Chance from '../components/Chance'
import Image from 'next/image';
import { MyConnect} from '../components/ConnectButton';

const Home: NextPage = () => {
  return (
    <div className="container mx-auto">
      <Head>
        <title>Prize Pool Contract</title>
        <meta content="Prize Pool Contract Information" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className="flex flex-col items-center justify-center h-full pt-20 md:pt-5">
      <div className="absolute top-5 left-5">
          <Image
            src="/images/logo.svg"
            height={70}
            width={70}
            alt="Win Win"
          />
        </div>
        <div className="absolute top-5 right-5">
          {/* <ConnectButton showBalance={false} /> */}
          <MyConnect connectText="CONNECT" />
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-14 w-full md:w-auto mt-16">
          <Prizes />
          <Rewards />
        </div>
        <Tvl />
        <UserBalancesAndChance /> 
        {/*
        <PrizesWon />
        <Chance /> */}
      </main>
    </div>
  );
};

export default Home;
