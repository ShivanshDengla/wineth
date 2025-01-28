import React, { useState, useEffect } from 'react';
import { formatUnits } from 'viem';
import { ADDRESS } from '../constants/address';
import { usePublicClient } from 'wagmi';

const TOTAL_DONATED = 13040; // Constant for already donated amount

const CharityAmount: React.FC = () => {
  const [yieldFeeBalance, setYieldFeeBalance] = useState<bigint>(BigInt(0));
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchYieldFeeBalance = async () => {
      if (!publicClient) return;
      
      try {
        const yieldFeeBalanceResult = await publicClient.readContract({
          address: ADDRESS.VAULT.ADDRESS,
          abi: [{
            name: 'yieldFeeBalance',
            type: 'function',
            stateMutability: 'view',
            inputs: [],
            outputs: [{ type: 'uint256' }]
          }],
          functionName: 'yieldFeeBalance'
        });
        setYieldFeeBalance(yieldFeeBalanceResult);
      } catch (error) {
        console.error('Error fetching yield fee balance:', error);
      }
    };

    fetchYieldFeeBalance();
  }, [publicClient]);

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