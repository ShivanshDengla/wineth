import React, { useEffect, useState } from 'react';
import { getTokenPrice } from '../fetch/getTokenPrice';
import { getTvl } from '../fetch/getTvl';
import { CONTRACTS } from '../constants/contracts';
import { REWARDS } from '../constants/rewards';

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
  tvl?: number;
  aprValue?: number;
}

const RewardsApr: React.FC = () => {
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
            // Fetch promotion details from the contract
            const promotion = await CONTRACTS.TWABREWARDS.read.getPromotion([PROMOTION]) as Promotion;

            const startTimestamp = parseInt(promotion.startTimestamp);
            const numberOfEpochs = parseInt(promotion.numberOfEpochs);
            const epochDuration = parseInt(promotion.epochDuration);
            const tokensPerEpoch = parseFloat(promotion.tokensPerEpoch);
            const promoEnd = startTimestamp + numberOfEpochs * epochDuration;

            // Ensure the promotion is active
            if (currentTimestamp < startTimestamp || currentTimestamp > promoEnd) {
              console.warn(`Promotion ${PROMOTION} for ${SYMBOL} is not currently active.`);
              continue;
            }

            // Calculate tokens per second and tokens per year
            const tokensPerSecond = tokensPerEpoch / epochDuration;
            const tokensPerYear = (tokensPerSecond / reward.DECIMALS) * (365 * 24 * 60 * 60);

            // Fetch token price and TVL
            const tokenPrice = await getTokenPrice(GECKO);
            const tvl = await getTvl();
            const adjustedTvl = tvl / 1e6;

            // Calculate APR
            const aprValue = (tokensPerYear * tokenPrice) / adjustedTvl;

            promotionDetails.push({
              PROMOTION,
              SYMBOL,
              startTimestamp,
              promoEnd,
              completedEpochs: Array.from({ length: numberOfEpochs }, (_, i) => i),
              tokensPerYear,
              tokenPrice,
              tvl: adjustedTvl,
              aprValue,
            });
          } catch (error) {
            console.error(`Failed to fetch data for promotion ${PROMOTION} (${SYMBOL}):`, error);
            continue;
          }
        }

        setPromotionData(promotionDetails);
      } catch (err: any) {
        console.error('Error fetching promotion data:', err);
        setError(`Failed to calculate promotion data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionData();
  }, []);

  const calculateTimeRemaining = (endTimestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const timeRemaining = endTimestamp - now;

    if (timeRemaining <= 0) return 'Ended';

    const days = Math.floor(timeRemaining / (24 * 60 * 60));
    const hours = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);

    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatNumber = (value: number | undefined, decimals: number = 2) => {
    return value !== undefined ? value.toFixed(decimals) : 'N/A';
  };

  if (loading) return <div>Loading APR data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>APR Details</h2>
      {promotionData.length > 0 ? (
        promotionData.map((promo, index) => (
          <div key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <h3>{promo.SYMBOL} Promotion (ID: {promo.PROMOTION})</h3>
            <p>Start Time: {new Date(promo.startTimestamp * 1000).toLocaleString()}</p>
            <p>End Time: {new Date(promo.promoEnd * 1000).toLocaleString()}</p>
            <p>Time Remaining: {calculateTimeRemaining(promo.promoEnd)}</p>
            <p>Completed Epochs: {promo.completedEpochs.length}</p>
            <p>Tokens Per Year: {formatNumber(promo.tokensPerYear)}</p>
            <p>Token Price: ${formatNumber(promo.tokenPrice)}</p>
            <p>Total Value Locked (TVL): ${formatNumber(promo.tvl ? promo.tvl * 1e6 : undefined)}</p>
            <p>APR: {formatNumber(promo.aprValue ? promo.aprValue * 100 : undefined)}%</p>
            <p>Estimated Yearly Rewards: ${formatNumber(promo.tokensPerYear && promo.tokenPrice ? promo.tokensPerYear * promo.tokenPrice : undefined)}</p>
          </div>
        ))
      ) : (
        <p>No active promotions</p>
      )}
    </div>
  );
};

export default RewardsApr;
