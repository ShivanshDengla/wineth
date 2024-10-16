import React, { useEffect, useState } from "react";
import { getBigWins } from "../fetch/getBigWinners";
import { ParsePrizeAmount } from "../utilities/ParseAmounts";
import { ADDRESS } from "../constants/address";
import PrizeTokenIcon from "./PrizeTokenIcon";

interface PrizeClaim {
  id: string;
  payout: string;
  timestamp: string;
  prizeVault: {
    id: string;
  };
  txHash: string;
}

const formatDistanceToNow = (date: Date): { value: number; unit: string } => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return { value: diffInSeconds, unit: 'second' };
  if (diffInSeconds < 3600) return { value: Math.floor(diffInSeconds / 60), unit: 'minute' };
  if (diffInSeconds < 86400) return { value: Math.floor(diffInSeconds / 3600), unit: 'hour' };
  return { value: Math.floor(diffInSeconds / 86400), unit: 'day' };
};

const BigWinners: React.FC = () => {
  const [prizeClaims, setPrizeClaims] = useState<PrizeClaim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPrizeClaims = async () => {
      try {
        const data = await getBigWins();
        setPrizeClaims(data);
      } catch (err) {
        console.error("Error fetching big wins:", err);
        setError(`Failed to load big wins: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    getPrizeClaims();
  }, []);

  if (loading) return <div className="animate-pulse bg-[#1d3053] h-12 w-5/5 mx-auto"></div>;
//   if (error) return <div className="text-red-500 bg-red-100 p-2 rounded-lg w-4/5 
// mx-auto">{error}</div>;

  const winnerContent = (
    <>
      {prizeClaims.map((claim, index) => {
        const timeAgo = formatDistanceToNow(new Date(parseInt(claim.timestamp) * 1000));
        return (
          <span key={claim.id} className="inline-flex items-center mr-8 text-[#c9d1ea] whitespace-nowrap text-sm">
           
              <PrizeTokenIcon size={18} />
         
            <span className="font-bold ml-1">{ParsePrizeAmount(BigInt(claim.payout))}</span>
            <span>&nbsp;won {timeAgo.value} {timeAgo.unit}{timeAgo.value !== 1 ? 's' : ''} ago</span>
          </span>
        );
      })}
    </>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-[#0E1E45] border-t border-[#1F3A6D] p-2 h-12 flex items-center overflow-hidden">
      <div className="inline-flex animate-marquee whitespace-nowrap">
        {winnerContent}
        {winnerContent}
      </div>
    </div>
  );
};

export default BigWinners;

// 
