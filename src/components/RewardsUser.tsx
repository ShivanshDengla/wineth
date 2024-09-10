import React from 'react';
import { useAccount } from 'wagmi';

interface UserRewardsProps {
  completedEpochs: number[];
  promotionData: any[];
  userRewards: Reward[];
}

export interface Reward {
  promotion: number;
  epochs: number[];
  amounts: number[];
}

const RewardsUser: React.FC<UserRewardsProps> = ({ completedEpochs, promotionData, userRewards }) => {
  const { address } = useAccount();

  if (!address) return <div>Please connect your wallet to see rewards data.</div>;
  if (userRewards.length === 0) return <div>No rewards available</div>;

  return (
    <div>
      <h2>User Rewards</h2>
      {userRewards.map((reward, index) => {
        const promotion = promotionData.find(p => p.PROMOTION === reward.promotion);
        const totalReward = reward.amounts.reduce((a, b) => a + b, 0);
        return (
          <div key={index}>
            <p>
              {promotion ? promotion.SYMBOL : 'Unknown'} Promotion {reward.promotion}: 
              {totalReward.toFixed(6)} tokens
            </p>
            <ul>
              {reward.epochs.map((epoch, i) => (
                <li key={i}>
                  Epoch {epoch}: {reward.amounts[i].toFixed(6)} tokens
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default RewardsUser;