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

const RewardsAPR: React.FC = () => {
  const [rewardData, setRewardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRewardData = async () => {
      try {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const rewardDetails: any[] = [];

        for (const reward of REWARDS) {
          const { PROMOTION, SYMBOL, GECKO, DECIMALS } = reward;

          try {
            // Fetch promotion details from the contract using the Promotion interface
            const promotion = await CONTRACTS.TWABREWARDS.read.getPromotion([PROMOTION]) as Promotion;

            const startTimestamp = parseInt(promotion.startTimestamp);
            const numberOfEpochs = parseInt(promotion.numberOfEpochs);
            const epochDuration = parseInt(promotion.epochDuration);
            const tokensPerEpoch = parseFloat(promotion.tokensPerEpoch);
            const promoEnd = startTimestamp + numberOfEpochs * epochDuration;

            // Check if the promotion is active
            if (currentTimestamp < startTimestamp || currentTimestamp > promoEnd) {
              console.warn(`Promotion ${PROMOTION} for ${SYMBOL} is not currently active.`);
              continue;
            }

            // Calculate tokens per second
            const tokensPerSecond = tokensPerEpoch / epochDuration;
            // Calculate tokens per year
            const tokensPerYear = (tokensPerSecond / DECIMALS) * (365 * 24 * 60 * 60);

            // Fetch the token price
            const tokenPrice = await getTokenPrice(GECKO);
            // Fetch the TVL
            const tvl = await getTvl();
            const adjustedTvl = tvl / 1e6; // Adjust TVL for USDC's 6 decimals

            // Calculate APR
            const aprValue = (tokensPerYear * tokenPrice) / adjustedTvl;

            rewardDetails.push({
              symbol: SYMBOL,
              tokensPerSecond,
              decimals: DECIMALS,
              tokensPerYear,
              tokenPrice,
              tvl: adjustedTvl,
              aprValue,
              startTimestamp,
              promoEnd,
            });
          } catch (error) {
            console.error(`Failed to fetch data for promotion ${PROMOTION} (${SYMBOL}):`, error);
            continue;
          }
        }

        setRewardData(rewardDetails);
      } catch (err: any) {
        console.error('Error fetching reward data:', err);
        setError(`Failed to calculate reward data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRewardData();
  }, []);

  if (loading) return <div>Loading Reward Data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>REWARDS:</h1>
      {rewardData.map((data, index) => (
        <div key={index}>
          <h2>{data.symbol} Reward Details</h2>
          <p>Tokens per Second: {data.tokensPerSecond}</p>
          <p>Decimals: {data.decimals}</p>
          <p>Tokens per Year: {data.tokensPerYear}</p>
          <p>Token Price: ${data.tokenPrice}</p>
          <p>Total Value Locked (TVL): {data.tvl * 1e6} USDC</p> {/* Showing the original TVL */}
          <p>Adjusted Vault TVL: ${data.tvl}</p>
          <p>Calculated APR Value: {data.aprValue}</p>
          <p>Promotion Start Time: {new Date(data.startTimestamp * 1000).toLocaleString()}</p>
          <p>Promotion End Time: {new Date(data.promoEnd * 1000).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default RewardsAPR;
