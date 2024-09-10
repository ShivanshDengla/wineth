import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { CONTRACTS } from '../constants/contracts';
import { Reward } from '../fetch/getRewards';

interface ClaimComponentProps {
  promotionData: any[];
  rewardAmounts: Reward[];
}
const ClaimComponent: React.FC<ClaimComponentProps> = ({ promotionData, rewardAmounts }) => {
  const { address } = useAccount();
  const [claimStatus, setClaimStatus] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async (promotionId: number, index: number) => {
    if (!address) {
      setError('Please connect your wallet to claim rewards.');
      return;
    }

    setClaimStatus(prev => ({ ...prev, [index]: 'Claiming...' }));
    setError(null);

    try {
      // Assuming the contract has a claim function that takes the promotion ID
      const tx = await CONTRACTS.TWABREWARDS.write.claim([promotionId]);
      // Handle transaction confirmation
      await tx.wait();
      setClaimStatus(prev => ({ ...prev, [index]: 'Claimed' }));
    } catch (err: any) {
      console.error('Error claiming reward:', err);
      setClaimStatus(prev => ({ ...prev, [index]: 'Failed' }));
      setError(`Failed to claim reward: ${err.message}`);
    }
  };

  if (!address) return <div>Please connect your wallet to view and claim rewards.</div>;

  // Ensure rewardAmounts is checked before mapping
  if (!rewardAmounts || rewardAmounts.length === 0) return <div>No rewards available to claim</div>;

  return (
    <div>
      <h2>Claim Rewards</h2>
      {error && <p className="error">{error}</p>}
      {rewardAmounts.map((reward, index) => {
        const promotion = promotionData.find(p => p.PROMOTION === reward.promotion);
        const totalReward = reward.amounts.reduce((a, b) => a + b, 0);
        const isClaimable = totalReward > 0;

        return (
          <div key={index}>
            <h3>{promotion ? promotion.SYMBOL : 'Unknown'} Promotion {reward.promotion}</h3>
            <p>Claimable Reward: {totalReward.toFixed(6)} tokens</p>
            <p>Claim Status: {claimStatus[index] || 'Not claimed'}</p>
            <button
              onClick={() => handleClaim(reward.promotion, index)}
              disabled={!isClaimable || claimStatus[index] === 'Claimed' || claimStatus[index] === 'Claiming...'}
            >
              {claimStatus[index] === 'Claimed' ? 'Claimed' : 'Claim Reward'}
            </button>
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

export default ClaimComponent;
