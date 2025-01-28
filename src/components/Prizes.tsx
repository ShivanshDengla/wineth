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
  if (!displayAmount || displayAmount <= BigInt(0)) return null;


  return (
    <div className="flex items-center justify-center gap-2 bg-[#28447A] border-2 border-[#C0ECFF] rounded-lg p-3 md:p-4 text-white text-base md:text-lg w-[280px] md:w-[340px] h-[50px] md:h-[60px] mx-auto">
      <PrizeTokenIcon size={20} />
      <p className="whitespace-nowrap overflow-hidden text-ellipsis text-center text-sm md:text-base">
        {ParsePrizeAmount(displayAmount ?? BigInt(0))} {ADDRESS.PRIZETOKEN.SYMBOL} {displayText}
      </p>
    </div>
  );
};

export default Prizes;
