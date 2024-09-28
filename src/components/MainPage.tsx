import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getRewards, PromotionData, RewardsData } from '../fetch/getRewards';
import { getUser } from '../fetch/getUser';
import { getPrizes, PrizeData } from '../fetch/getPrizes';
import Prizes from './Prizes';
import RewardsApr from './RewardsApr';
import UserInfo from './UserInfo';
import { GetChance, ChanceResult } from "../fetch/getChance";

const MainPage: React.FC = () => {
  const { address } = useAccount();
  const [promotionData, setPromotionData] = useState<PromotionData[]>([]);
  const [userRewards, setUserRewards] = useState<RewardsData[]>([]);
  const [userData, setUserData] = useState<{
    UserDepositTokens: bigint;
    UserAllowance: bigint;
    UserVaultTokens: bigint;
  } | null>(null);
  const [prizes, setPrizes] = useState<PrizeData>({ accountedBalance: BigInt(0), grandPrizeLiquidity: BigInt(0) });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userChance, setUserChance] = useState<ChanceResult | null>(null);

  const fetchAllData = async () => {
    if (!address) return;

    try {
      setLoading(true);
      const [userDataResult, chanceResult, prizesResult, rewardsResult] = await Promise.all([
        getUser(address),
        GetChance(address),
        getPrizes(),
        getRewards(address)
      ]);

      setUserData(userDataResult);
      setUserChance(chanceResult);
      setPrizes(prizesResult);
      setPromotionData(rewardsResult.promotionData);
      setUserRewards(rewardsResult.userRewards);
    } catch (err: any) {
      setError(`Failed to fetch data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) return <div>Loading data...</div>;
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