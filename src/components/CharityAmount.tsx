import React from 'react';
import { formatUnits } from 'viem';
import { ADDRESS } from '../constants/address';

interface CharityAmountProps {
  yieldFeeBalance: bigint;
}

const TOTAL_DONATED = 13040; // Constant for already donated amount

const CharityAmount: React.FC<CharityAmountProps> = ({ yieldFeeBalance }) => {
  const currentBalance = parseFloat(
    formatUnits(yieldFeeBalance, ADDRESS.DEPOSITTOKEN.DECIMALS)
  );
  
  const totalAmount = (currentBalance + TOTAL_DONATED).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div className="flex items-center justify-center bg-[#28447A] border-2 border-[#C0ECFF] rounded-lg p-2 md:p-2 text-white w-[280px] md:h-[50px] md:h-[70px] mx-auto">
      <div className="flex items-center gap-2">
        <p className="text-sm md:text-base font-bold text-[#C0ECFF]">${totalAmount}</p>
        <p className="text-sm md:text-base text-gray-200">Donated</p>
      </div>
    </div>
  );
};

export default CharityAmount; 