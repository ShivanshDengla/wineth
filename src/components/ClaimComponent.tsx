import React, { useState } from 'react';
import { CONTRACTS } from '../constants/contracts';
import { useAccount } from 'wagmi';

interface ClaimComponentProps {
  promotionData: any[];
  rewardAmounts: number[];
}

const ClaimComponent: React.FC<ClaimComponentProps> = ({ promotionData, rewardAmounts }) => {
  const { address } = useAccount();
  const [claimStatus, setClaimStatus] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async (promotionId: number, index: number) => {
    if (!address) {
      setError("Please connect your wallet to claim rewards.");
      return;
    }

    setClaimStatus(prev => ({ ...prev, [index]: 'Claiming...' }));
    setError(null);

    try {
      // Assuming the contract has a claim function that takes the promotion ID
      const tx = await CONTRACTS.TWABREWARDS.write.claim([promotionId]);
      await tx.wait();
      setClaimStatus(prev => ({ ...prev, [index]: 'Claimed' }));
    } catch (err: any) {
      console.error('Error claiming reward:', err);
      setClaimStatus(prev => ({ ...prev, [index]: 'Failed' }));
      setError(`Failed to claim reward: ${err.message}`);
    }
  };

  if (!address) {
    return <div>Please connect your wallet to view and claim rewards.</div>;
  }

  return (
    <div>
      <h2>Claim Rewards</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {promotionData.length > 0 ? (
        promotionData.map((promo, index) => {
          const rewardAmount = rewardAmounts[index] || 0;
          const isClaimable = rewardAmount > 0;
          return (
            <div key={index}>
              <h3>Promotion {promo.PROMOTION}</h3>
              <p>Claimable Reward: {rewardAmount.toFixed(6)} tokens</p>
              <p>Claim Status: {claimStatus[index] || 'Not claimed'}</p>
              <button 
                onClick={() => handleClaim(promo.PROMOTION, index)}
                disabled={!isClaimable || claimStatus[index] === 'Claimed' || claimStatus[index] === 'Claiming...'}
              >
                {claimStatus[index] === 'Claimed' ? 'Claimed' : 'Claim Reward'}
              </button>
            </div>
          );
        })
      ) : (
        <p>No rewards available to claim</p>
      )}
    </div>
  );
};

export default ClaimComponent;