// components/Prizes.tsx
import { useState, useEffect } from "react";
import { ParsePrizeAmount } from "../utilities/ParseAmounts";
import PrizeTokenIcon from './PrizeTokenIcon';
import { ADDRESS } from "../constants/address";
import { PrizeData } from "../fetch/getPrizes";


type DisplayType = 'prizePool' | 'grandPrize';

interface PrizesProps {
  prizes: PrizeData;
}

const Prizes: React.FC<PrizesProps> = ({ prizes }) => {
  const [displayType, setDisplayType] = useState<DisplayType>('prizePool');

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayType(prev => prev === 'prizePool' ? 'grandPrize' : 'prizePool');
    }, 6000); // Switch every 6 seconds

    return () => clearInterval(interval);
  }, []);

  if (!prizes) return null;

  const prizePoolAmount = prizes.accountedBalance;
  const grandPrizeAmount = prizes.grandPrizeLiquidity ? prizes.grandPrizeLiquidity / BigInt(2) : null;

  const displayAmount = displayType === 'prizePool' ? prizePoolAmount : grandPrizeAmount;
  const displayText = displayType === 'prizePool' ? "Prizes" : "Jackpot";

  return (
    <div className="flex items-center justify-center gap-2 bg-[#28447A] border-2 border-[#C0ECFF] rounded-lg p-4 text-white text-lg sm:text-base md:text-lg w-[340px] h-[60px]">
      <PrizeTokenIcon size={24} />
      <p className="whitespace-nowrap overflow-hidden text-ellipsis text-center">
        {ParsePrizeAmount(displayAmount ?? BigInt(0))} {ADDRESS.PRIZETOKEN.SYMBOL} {displayText}
      </p>
    </div>
  );
};

export default Prizes;
