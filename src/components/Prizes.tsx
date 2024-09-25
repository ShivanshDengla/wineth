// components/Prizes.tsx
import { useEffect, useState } from "react";
import { getPrizes } from "../fetch/getPrizes";
import { ParsePrizeAmount } from "../utilities/ParseAmounts";
import PrizeTokenIcon from './PrizeTokenIcon';
import { ADDRESS } from "../constants/address";

interface PrizeData {
  accountedBalance: bigint;
  grandPrizeLiquidity: bigint;
}

type DisplayType = 'prizePool' | 'grandPrize';

const Prizes = () => {
  const [data, setData] = useState<PrizeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayType, setDisplayType] = useState<DisplayType>('prizePool');

  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const prizeData = await getPrizes();
        if (prizeData !== null) {
          // todo typing force
          setData(prizeData as any);
        } else {
          setError("Failed to fetch prize data");
        }
      } catch (err: any) {
        setError(`Failed to fetch prize data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPrizes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayType(prev => prev === 'prizePool' ? 'grandPrize' : 'prizePool');
    }, 6000); // Switch every 6 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) return 
  <div>
    {/* Loading Prizes... */}
    </div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  const prizePoolAmount = data.accountedBalance;
  const grandPrizeAmount = data.grandPrizeLiquidity / BigInt(2);

  const displayAmount = displayType === 'prizePool' ? prizePoolAmount : grandPrizeAmount;
  const displayText = displayType === 'prizePool' ? "Prize Pool" : "Jackpot";

  return (
    <div className="flex items-center justify-center gap-2 bg-[#28447A] border-2 border-[#C0ECFF] rounded-lg p-4 text-white text-lg sm:text-base md:text-lg w-[340px] h-[60px]">
      <PrizeTokenIcon size={24} />
      <p className="whitespace-nowrap overflow-hidden text-ellipsis text-center">
        {ParsePrizeAmount(displayAmount)} {ADDRESS.PRIZETOKEN.SYMBOL} {displayText}
      </p>
    </div>
  );
};

export default Prizes;
