import React, { useEffect, useState } from 'react';
import { CONTRACTS } from '../constants/contracts';
import { useAccount } from 'wagmi';

interface UserRewardsProps {
  completedEpochs: number[];
  promotionData: any[];
}

export interface Reward {
  promotion: number;
  epochs: number[];
  amounts: number[];
}

const RewardsUser: React.FC<UserRewardsProps> = ({ completedEpochs, promotionData }) => {
  const { address } = useAccount();
  const [rewardsData, setRewardsData] = useState<Reward[]>([]);
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRewardAmounts = async () => {
      if (!address || completedEpochs.length === 0) {
        setRewardsData([]);
        setLoadingRewards(false);
        return;
      }

      try {
        const rewards: Reward[] = [];

        for (const promo of promotionData) {
          const { PROMOTION } = promo;

          console.log(`Fetching rewards for Promotion ID ${PROMOTION} and Epochs: ${completedEpochs}`);

          // Fetch reward amounts from the contract
          const rewardArray = await CONTRACTS.TWABREWARDS.read.getRewardsAmount([
            address,
            PROMOTION,
            completedEpochs
          ]);

          const rewardAmounts: number[] = rewardArray.map((reward: bigint, index: number) => {
            const rewardAmount = Number(reward) / 1e18;
            console.log(`Reward for Epoch ${completedEpochs[index]}: ${rewardAmount}`);
            return rewardAmount;
          });

          rewards.push({
            promotion: PROMOTION,
            epochs: completedEpochs,
            amounts: rewardAmounts
          });
        }

        setRewardsData(rewards);
      } catch (err: any) {
        console.error(`Failed to fetch reward amounts:`, err);
        setError(`Failed to fetch reward amounts: ${err.message}`);
      } finally {
        setLoadingRewards(false);
      }
    };

    fetchRewardAmounts();
  }, [address, promotionData, completedEpochs]);

  // This function can be used by parent components to access the rewards data
  const getUserRewards = (): Reward[] => {
    return rewardsData;
  };

  if (!address) return <div>Please connect your wallet to see rewards data.</div>;
  if (loadingRewards) return <div>Loading Rewards...</div>;
  if (error) return <div>Error: {error}</div>;

  // Render a minimal UI, but make the data available through getUserRewards
  return (
    <div>
      <h2>User Rewards</h2>
      {rewardsData.length > 0 ? (
        rewardsData.map((reward, index) => (
          <div key={index}>
            <p>Promotion {reward.promotion}: {reward.amounts.reduce((a, b) => a + b, 0).toFixed(6)} tokens</p>
          </div>
        ))
      ) : (
        <p>No rewards available</p>
      )}
    </div>
  );
};

export default RewardsUser;