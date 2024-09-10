// components/RewardsComponent.tsx
import React, { useEffect, useState } from 'react';
import { CONTRACTS } from '../constants/contracts';
import { REWARDS } from '../constants/rewards';
import RewardsApr from './RewardsApr';
import RewardsUser from './RewardsUser';
import ClaimComponent from './ClaimComponent';
import { useAccount } from 'wagmi';

const Rewards: React.FC = () => {
  const { address } = useAccount();
  const [completedEpochs, setCompletedEpochs] = useState<number[]>([]);
  const [promotionData, setPromotionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotionData = async () => {
      try {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const promotionDetails: any[] = [];

        for (const reward of REWARDS) {
          const { PROMOTION } = reward;

          try {
            const promotion = await CONTRACTS.TWABREWARDS.read.getPromotion([PROMOTION]);
            const startTimestamp = parseInt(promotion.startTimestamp);
            const numberOfEpochs = parseInt(promotion.numberOfEpochs);
            const epochDuration = parseInt(promotion.epochDuration);
            const promoEnd = startTimestamp + numberOfEpochs * epochDuration;

            const completedEpochsTemp = getCompletedEpochs(startTimestamp, epochDuration, numberOfEpochs, currentTimestamp);
            promotionDetails.push({
              PROMOTION,
              startTimestamp,
              numberOfEpochs,
              epochDuration,
              promoEnd,
              completedEpochs: completedEpochsTemp,
            });

            setCompletedEpochs(completedEpochsTemp);
          } catch (err) {
            console.error(`Error fetching promotion data for ${PROMOTION}:`, err);
            continue;
          }
        }

        setPromotionData(promotionDetails);
      } catch (err) {
        console.error('Error fetching promotion data:', err);
        setError(`Failed to fetch promotion data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionData();
  }, [address]);

  const getCompletedEpochs = (
    startTimestamp: number,
    epochDuration: number,
    numberOfEpochs: number,
    currentTimestamp: number
  ) => {
    const completedEpochs = [];

    for (let epoch = 0; epoch < numberOfEpochs; epoch++) {
      const epochEndTime = startTimestamp + (epoch + 1) * epochDuration;
      if (epochEndTime <= currentTimestamp) {
        completedEpochs.push(epoch);
      } else {
        break;
      }
    }

    return completedEpochs;
  };

  if (loading) return <div>Loading Promotion Data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Rewards Overview</h1>
      <RewardsApr promotionData={promotionData} />
      <RewardsUser completedEpochs={completedEpochs} promotionData={promotionData} />
      <ClaimComponent promotionData={promotionData} rewardAmounts={[]} />
    </div>
  );
};

export default Rewards;
