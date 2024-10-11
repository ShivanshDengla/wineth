// pages/index.tsx
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Tvl from '../components/Tvl';
import Prizes from '../components/Prizes';
import UserBalancesAndChance from '../components/UserInfo';
import Rewards from '../components/Rewards';
import PrizesWon from '../components/PrizesWon';
import Chance from '../components/Chance'
import Image from 'next/image';
import { MyConnect} from '../components/ConnectButton';
import BigWinners from '../components/BigWinners';
import MainPage from '../components/MainPage';

const Home: NextPage = () => {
  return (
    <div className="container mx-auto">
      <Head>
        <title>winEth | PoolTogether Charity Vault</title>
        <meta content="Contribute to a good cause while saving and winning with PoolTogether" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className="flex flex-col items-center justify-center h-full pt-2">
        <div className="w-full flex justify-between items-center p-2">
          <div>
            <Image
              src="/images/trophy_white.png"
              height={150}
              width={150}
              alt="Win Win"
            />
          </div>
          <div>
            <MyConnect connectText="CONNECT" />
          </div>
        </div>
      
        <MainPage />
        <Tvl />
        {/*
        <PrizesWon />
        <Chance /> */}
        <BigWinners />
      </main>
    </div>
  );
};

export default Home;
