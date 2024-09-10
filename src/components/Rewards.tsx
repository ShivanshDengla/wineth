// components/RewardsComponent.tsx
import React, { useEffect, useState } from 'react';
import { CONTRACTS } from '../constants/contracts';
import { REWARDS } from '../constants/rewards';
import RewardsApr from './RewardsApr';
import RewardsUser from './RewardsUser';
import ClaimComponent from './ClaimComponent';
import { useAccount } from 'wagmi';
import { getTokenPrice } from "../fetch/getTokenPrice";
import { getTvl } from "../fetch/getTvl";
import { formatUnits } from "viem";
import { ADDRESS } from "../constants/address";

interface Promotion {
  startTimestamp: string;
  numberOfEpochs: string;
  epochDuration: string;
  tokensPerEpoch: string;
}

interface PromotionData {
  PROMOTION: number;
  SYMBOL: string;
  startTimestamp: number;
  promoEnd: number;
  completedEpochs: number[];
  tokensPerYear?: number;
  tokenPrice?: number;
  tvl?: string;
  aprValue?: number;
}

const Rewards: React.FC = () => {
  const { address } = useAccount();
  const [promotionData, setPromotionData] = useState<PromotionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotionData = async () => {
      try {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const promotionDetails: PromotionData[] = [];

        for (const reward of REWARDS) {
          const { PROMOTION, SYMBOL, GECKO } = reward;

          try {
            const promotion = await CONTRACTS.TWABREWARDS.read.getPromotion([PROMOTION]) as Promotion;
            const startTimestamp = parseInt(promotion.startTimestamp);
            const numberOfEpochs = parseInt(promotion.numberOfEpochs);
            const epochDuration = parseInt(promotion.epochDuration);
            const tokensPerEpoch = parseFloat(promotion.tokensPerEpoch);
            const promoEnd = startTimestamp + numberOfEpochs * epochDuration;

            if (currentTimestamp < startTimestamp || currentTimestamp > promoEnd) {
              console.warn(`Promotion ${PROMOTION} for ${SYMBOL} is not currently active.`);
              continue;
            }

            const tokensPerSecond = tokensPerEpoch / epochDuration;
            const tokensPerYear = (tokensPerSecond / reward.DECIMALS) * (365 * 24 * 60 * 60);

            const tokenPrice = await getTokenPrice(GECKO);
            const tvl = await getTvl();
            const adjustedTvl = formatUnits(tvl, ADDRESS.VAULT.DECIMALS);

            const aprValue = (tokensPerYear * tokenPrice) / parseFloat(adjustedTvl);

            const completedEpochs = getCompletedEpochs(startTimestamp, epochDuration, numberOfEpochs, currentTimestamp);

            promotionDetails.push({
              PROMOTION,
              SYMBOL,
              startTimestamp,
              promoEnd,
              completedEpochs,
              tokensPerYear,
              tokenPrice,
              tvl: adjustedTvl,
              aprValue,
            });
          } catch (err) {
            console.error(`Error fetching promotion data for ${PROMOTION}:`, err);
            continue;
          }
        }

        setPromotionData(promotionDetails);
      } catch (err) {
        console.error('Error fetching promotion data:', err);
        setError(`Failed to fetch promotion data: ${(err as Error).message}`);
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
      <RewardsUser completedEpochs={promotionData.flatMap(p => p.completedEpochs)} promotionData={promotionData} />
      <ClaimComponent promotionData={promotionData} rewardAmounts={[]} />
    </div>
  );
};

export default Rewards;