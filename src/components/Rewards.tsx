// components/RewardsComponent.tsx
import React, { useEffect, useState } from 'react';
import RewardsApr from './RewardsApr';
import RewardsUser from './RewardsUser';
import ClaimComponent from './ClaimComponent';
import { useAccount } from 'wagmi';
import { getRewards, PromotionData, Reward } from '../fetch/getRewards';

const Rewards: React.FC = () => {
  const { address } = useAccount();
  const [promotionData, setPromotionData] = useState<PromotionData[]>([]);
  const [userRewards, setUserRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { promotionData, userRewards } = await getRewards(address);
        setPromotionData(promotionData);
        setUserRewards(userRewards);
      } catch (err) {
        console.error('Error fetching rewards data:', err);
        setError(`Failed to fetch rewards data: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  if (loading) return <div>Loading Rewards Data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Rewards Overview</h1>
      <RewardsApr promotionData={promotionData} />
      <RewardsUser completedEpochs={promotionData.flatMap(p => p.completedEpochs)} promotionData={promotionData} userRewards={userRewards} />
      <ClaimComponent promotionData={promotionData} rewardAmounts={userRewards} />
    </div>
  );
};

export default Rewards;