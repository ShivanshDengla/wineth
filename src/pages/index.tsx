// pages/index.tsx
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
// import Tvl from '../components/Tvl';
import Prizes from '../components/Prizes';
import UserBalancesAndChance from '../components/UserInfo';
import Rewards from '../components/Rewards';
import PrizesWon from '../components/PrizesWon';
import Chance from '../components/Chance'
import Image from 'next/image';
import { MyConnect} from '../components/ConnectButton';
import BigWinners from '../components/BigWinners';
import MainPage from '../components/MainPage';
import PoweredBy from '../components/PoweredBy';

const Home: NextPage = () => {
  return (
    <div className="container mx-auto">
      <Head>
        <title>winEth | PoolTogether Charity Vault</title>
        <meta content="Contribute to a good cause while saving and winning with PoolTogether" name="description" />
        <link href="/images/favicon.ico" rel="icon" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="winEth | PoolTogether Charity Vault" />
        <meta property="og:description" content="Contribute to a good cause while saving and winning with PoolTogether" />
        <meta property="og:image" content="https://wineth.org/images/embed.png" />
        <meta property="og:url" content="https://wineth.org" />
        <meta property="og:type" content="website" />


        {/* Twitter Card Images */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="winEth | PoolTogether Charity Vault" />
        <meta name="twitter:description" content="Contribute to a good cause while saving and winning with PoolTogether." />
        <meta name="twitter:image" content="https://wineth.org/images/embed.png" />


      </Head>

      <main className="flex flex-col items-center justify-center h-full">
        <div className="w-full flex justify-between items-center p-2">
          <div>
            <Image
              src="/images/wineth.png"
              height={0} // Keep height for aspect ratio
              width={125} // Set width to 0 to allow auto-adjust
              alt="WinEth Logo"
              className="h-auto sm:w-[150px]" // Adjust class for height
            />
          </div>
          <div>
            <MyConnect connectText="CONNECT" />
          </div>
        </div>
      
        <MainPage />
        {/* <Tvl /> */}
        {/*
        <PrizesWon />
        <Chance /> */}
        <PoweredBy />
        <BigWinners />
      </main>
    </div>
  );
};

export default Home;
