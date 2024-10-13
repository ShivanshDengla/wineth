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
        <link href="/images/favicon.ico" rel="icon" />
      </Head>

      <main className="flex flex-col items-center justify-center h-full">
        <div className="w-full flex justify-between items-center p-2">
          <div>
            <Image
              src="/images/wineth.png"
              height={0} // Keep height for aspect ratio
              width={100} // Set width to 0 to allow auto-adjust
              alt="WinEth Logo"
              className="h-auto sm:w-[150px]" // Adjust class for height
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
