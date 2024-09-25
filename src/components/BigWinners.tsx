import React, { useEffect, useState } from "react";
import { getBigWins } from "../fetch/getBigWinners";
import { ParsePrizeAmount } from "../utilities/ParseAmounts";
import { ADDRESS } from "../constants/address";

interface PrizeClaim {
  id: string;
  payout: string;
  timestamp: string;
  prizeVault: {
    id: string;
  };
  txHash: string;
}

const formatDistanceToNow = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
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

  if (loading) return <div className="animate-pulse bg-[#1d3053] h-14 w-5/5 mx-auto"></div>;
  if (error) return <div className="text-red-500 bg-red-100 p-2 rounded-lg w-4/5 mx-auto">{error}</div>;

  const winnerContent = (
    <>
      {prizeClaims.map((claim, index) => (
        <span key={claim.id} className="inline-flex items-center mr-8 text-white whitespace-nowrap">
          <img 
            src={ADDRESS.PRIZETOKEN.ICON} 
            alt="Prize Token" 
            className="w-5 h-5 mr-2 object-contain"
          />
          <span className="font-bold">{ParsePrizeAmount(BigInt(claim.payout))}</span>
          <span className="ml-2">won</span>
          <span className="ml-2">
            {formatDistanceToNow(new Date(parseInt(claim.timestamp) * 1000))}
          </span>
          {index < prizeClaims.length - 1 && <span className="mx-4 text-[#3B82F6]"></span>}
        </span>
      ))}
    </>
  );

  return (
    <div className="w-4/5 mx-auto mt-10 bg-[#0E1E45] border border-[#1F3A6D] rounded-lg p-4 h-16 flex items-center overflow-hidden">
      <div className="inline-flex animate-marquee whitespace-nowrap">
        {winnerContent}
        {winnerContent}
      </div>
    </div>
  );
};

export default BigWinners;

// 