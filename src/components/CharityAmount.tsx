import React, { useState, useEffect } from 'react';
import { formatUnits } from 'viem';
import { ADDRESS } from '../constants/address';
import { usePublicClient } from 'wagmi';
import CountUp from 'react-countup';

const TOTAL_DONATED = 13040+13710; // Constant for already donated amount

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
  
  const totalAmount = currentBalance + TOTAL_DONATED;

  return (
    <div className="flex items-center justify-center bg-[#28447A] border-2 border-[#C0ECFF] w-[280px] mx-auto md:border-0 md:w-auto md:mx-0 md:bg-[#2A2A5B] rounded-lg p-2 text-white text-sm">
      <div className="flex items-center gap-2">
        <p className="font-bold text-[#C0ECFF]">
          $<CountUp
            end={totalAmount}
            duration={2.5}
            separator=","
            decimal="."
            decimals={0}
          />
        </p>
        <p className="text-gray-200">Donated</p>
      </div>
    </div>
  );
};

export default CharityAmount; 