import React from "react";
import Image from "next/image";
import { REWARDS } from "../constants/rewards";

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

interface RewardsAprProps {
  promotionData: PromotionData[];
}

const RewardsApr: React.FC<RewardsAprProps> = ({ promotionData }) => {
  const calculateTimeRemaining = (endTimestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const timeRemaining = endTimestamp - now;

    if (timeRemaining <= 0) return "Ended";

    const days = Math.floor(timeRemaining / (24 * 60 * 60));
    const hours = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);

    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatNumber = (value: number | undefined, decimals: number = 2) => {
    return value !== undefined ? value.toFixed(decimals) : "N/A";
  };

  return (
    // <div>
    //   <h2>APR Details</h2>
    //   {promotionData.length > 0 ? (
    //     promotionData.map((promo, index) => (
    //       <div
    //         key={index}
    //         style={{
    //           marginBottom: "20px",
    //           border: "1px solid #ccc",
    //           padding: "10px",
    //         }}>
    //         <h3>
    //           {promo.SYMBOL} Promotion (ID: {promo.PROMOTION})
    //         </h3>
    //         <p>
    //           Start Time:{" "}
    //           {new Date(promo.startTimestamp * 1000).toLocaleString()}
    //         </p>
    //         <p>End Time: {new Date(promo.promoEnd * 1000).toLocaleString()}</p>
    //         <p>Time Remaining: {calculateTimeRemaining(promo.promoEnd)}</p>
    //         <p>Completed Epochs: {promo.completedEpochs.length}</p>
    //         <p>Tokens Per Year: {formatNumber(promo.tokensPerYear)}</p>
    //         <p>Token Price: ${formatNumber(promo.tokenPrice)}</p>
    //         <p>
    //           Total Value Locked (TVL): $
    //           {formatNumber(promo.tvl ? parseFloat(promo.tvl) * 1e6 : undefined)}
    //         </p>
    //         <p>
    //           APR:{" "}
    //           {formatNumber(promo.aprValue ? promo.aprValue * 100 : undefined)}%
    //         </p>
    //         <p>
    //           Estimated Yearly Rewards: $
    //           {formatNumber(
    //             promo.tokensPerYear && promo.tokenPrice
    //               ? promo.tokensPerYear * promo.tokenPrice
    //               : undefined
    //           )}
    //         </p>
    //       </div>
    //     ))
    //   ) : (
    //     <p>No active promotions</p>
    //   )}
    // </div>
    <div className="flex justify-center mt-10">
      <div
        className="flex items-center py-3 px-6 rounded-lg shadow-lg"
        style={{
          backgroundColor: '#28447A', // Background color
          borderColor: '#C0ECFF', // Border color
          borderWidth: '2px', // Border thickness
          borderStyle: 'solid', // Solid border
        }}
      >
        {promotionData.length > 0 && promotionData.map((promo, index) => {
          // Find corresponding REWARDS object by PROMOTION
          const rewardInfo = REWARDS.find(reward => reward.PROMOTION === promo.PROMOTION);

          return (
            <div key={index} className="flex items-center space-x-2">
              {/* APR Value */}
              <p className="text-white text-lg">
                +{formatNumber(promo.aprValue ? promo.aprValue * 100 : undefined)}% 
              </p>
              {/* OP Logo */}
              {rewardInfo?.IMAGE && (
                <Image
                  src={rewardInfo.IMAGE} // Ensure you have the correct path for the OP logo
                  alt={`${rewardInfo.SYMBOL} Logo`}
                  width={20} // Width of the logo
                  height={20} // Height of the logo
                />
              )}
              <p className="text-white text-lg">Rewards</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RewardsApr;