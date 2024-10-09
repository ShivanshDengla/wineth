import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getRewards, PromotionData, RewardsData } from '../fetch/getRewards';
import { getUser, UserData } from '../fetch/getUser';
import { getPrizes, PrizeData } from '../fetch/getPrizes';
import Prizes from './Prizes';
import RewardsApr from './RewardsApr';
import UserInfo from './UserInfo';
import { GetChance, ChanceResult } from "../fetch/getChance";

const MainPage: React.FC = () => {
  const { address } = useAccount();
  const [promotionData, setPromotionData] = useState<PromotionData[]>([]);
  const [userRewards, setUserRewards] = useState<RewardsData[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [prizes, setPrizes] = useState<PrizeData>({ accountedBalance: BigInt(0), grandPrizeLiquidity: BigInt(0) });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userChance, setUserChance] = useState<ChanceResult | null>(null);

  const fetchAllData = async () => {
    // if (!address) return;

    try {
      setLoading(true);
      // Initialize empty array for promises
// Create an array of promises
const promises = [];

// Add calls that require address only if the address is defined
if (address !== undefined) {
  promises.push(getUser(address));   // Fetch user data if address is defined
  promises.push(GetChance(address)); // Fetch chance data if address is defined
} else {
  promises.push(Promise.resolve(null)); // Add null to maintain consistent indexing
  promises.push(Promise.resolve(null));
}
promises.push(getRewards(address)); // Fetch rewards if address is defined

// Add calls that do not require address
promises.push(getPrizes()); // Fetch prizes regardless of address

// Execute all promises in parallel using Promise.all
const [userDataResult, chanceResult, rewardsResult, prizesResult] = await Promise.all(promises) as [
  UserData | null, 
  ChanceResult | null, 
  { promotionData: PromotionData[]; userRewards: RewardsData[]; } | null, 
  PrizeData | null
];

// Set the state based on the resolved results
if (userDataResult !== null) {
  setUserData(userDataResult);
}

if (chanceResult !== null) {
  setUserChance(chanceResult);
}

if (rewardsResult !== null) {
  setPromotionData(rewardsResult.promotionData);
  setUserRewards(rewardsResult.userRewards);
}

// Set prizes if the result is not null
if (prizesResult !== null) {
  console.log("setting prizes")
  setPrizes(prizesResult);
}
    }catch(e){console.log(e)}}
  const updateUserBalancesAndChance = async () => {
    if (!address) return;

    try {
      const [userDataResult, chanceResult] = await Promise.all([
        getUser(address),
        GetChance(address)
      ]);

      setUserData(userDataResult);
      setUserChance(chanceResult);
    } catch (err: any) {
      console.error(`Failed to update user data: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [address]);

  // if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-14 w-full md:w-auto mt-8 md:mt-16">
        <Prizes prizes={prizes} />
        <RewardsApr promotionData={promotionData} />
      </div>
      <UserInfo
        rewardsData={userRewards}
        userData={userData}
        userChance={userChance}
        onDataUpdate={updateUserBalancesAndChance}
      />
    </div>
  );
};

export default MainPage;