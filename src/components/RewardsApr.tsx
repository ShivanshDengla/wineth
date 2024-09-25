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
    <>
      {promotionData.length > 0 && promotionData.map((promo, index) => {
        const rewardInfo = REWARDS.find(reward => reward.PROMOTION === promo.PROMOTION);

        return (
          <div className="flex items-center justify-center bg-[#28447A] border-2 border-[#C0ECFF] rounded-lg p-4 text-white text-lg sm:text-base md:text-lg w-[340px] h-[60px]">
            {promotionData.length > 0 && promotionData.map((promo, index) => {
              const rewardInfo = REWARDS.find(reward => reward.PROMOTION === promo.PROMOTION);
      
              return (
                <div key={index} className="flex items-center gap-2">
                  <p>+{formatNumber(promo.aprValue ? promo.aprValue * 100 : undefined)}%</p>
      
                  {rewardInfo?.IMAGE && (
                    <Image
                      src={rewardInfo.IMAGE}
                      alt={`${rewardInfo.SYMBOL} Logo`}
                      width={20}
                      height={20}
                    />
                  )}
                  <p>Rewards</p>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

export default RewardsApr;