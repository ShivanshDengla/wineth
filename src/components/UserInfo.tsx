import { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { ADDRESS } from "../constants/address";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";
// import RewardsClaim from "./RewardsClaim.tsx.WIP";
import { RewardsData } from "../fetch/getRewards";
import {
  ParseDepositTokenAmount,
  ParseVaultAmount,
} from "../utilities/ParseAmounts";
import { ChanceResult } from "../fetch/getChance";
import {REWARDS} from "../constants/rewards";
import Image from "next/image";
import { formatUnits } from "viem";
interface UserData {
  UserDepositTokens: bigint;
  UserAllowance: bigint;
  UserVaultTokens: bigint;
}
import { CropDecimals } from "../utilities/ParseAmounts";
import { MyConnect } from "./ConnectButton";
interface UserBalancesAndChanceProps {
  rewardsData: RewardsData[] | null;
  userData: UserData | null;
  userChance: ChanceResult | null;
  onDataUpdate: () => void;
}

// Custom hook to check if element touches screen edges
function useElementTouchesEdges() {
  const ref = useRef<HTMLDivElement>(null);
  const [touchesEdges, setTouchesEdges] = useState(false);

  useEffect(() => {
    const checkTouchesEdges = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const touchesLeft = rect.left <= 1; // Allow 1px tolerance
        const touchesRight = rect.right >= window.innerWidth - 1;
        setTouchesEdges(touchesLeft && touchesRight);
      }
    };

    checkTouchesEdges();
    window.addEventListener('resize', checkTouchesEdges);
    return () => window.removeEventListener('resize', checkTouchesEdges);
  }, []);

  return [ref, touchesEdges] as const;
}

const UserInfo: React.FC<UserBalancesAndChanceProps> = ({
  rewardsData,
  userData,
  userChance,
  onDataUpdate
}) => {
  const { address } = useAccount();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [ref, touchesEdges] = useElementTouchesEdges();

  console.log("user chance",userChance?.grandPrize.vaultPortion)
  if (!address) return (
    <div className="flex flex-col items-center justify-center py-8 px-6 mt-6 text-white text-lg w-full md:w-auto bg-[#28447A] border-l-4 border-r-4 md:border-l-[#C0ECFF] md:border-r-[#C0ECFF] border-l-transparent border-r-transparent rounded-lg shadow-md">
      <p className="text-xl font-semibold mb-4">Wallet Not Connected</p>
      <div><MyConnect connectText={"CONNECT TO WIN"}/></div>
    </div>
  );
  
  if (!userData || !userChance) return (
    <div className="flex items-center justify-center py-8 px-6 mt-6 text-white text-lg w-full md:w-auto bg-[#28447A] border-l-4 border-r-4 md:border-l-[#C0ECFF] md:border-r-[#C0ECFF] border-l-transparent border-r-transparent rounded-lg shadow-md">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mr-3"></div>
      <p>Loading User Data...</p>
    </div>
  );

  const hasDepositTokens = userData.UserDepositTokens > BigInt(0);
  const hasVaultTokens = userData.UserVaultTokens > BigInt(0);

  return (
    <div 
      ref={ref}
      className={`flex flex-col items-start py-4 px-6 mt-6 mb-20 text-white text-lg w-full md:w-auto bg-[#28447A] border-l-4 border-r-4 space-y-6 sm:space-y-2 ${
        touchesEdges ? 'border-l-transparent border-r-transparent' : 'border-l-[#C0ECFF] border-r-[#C0ECFF]'
      }`}
    >
      {!hasDepositTokens && !hasVaultTokens ? (
        <p>Welcome winner! For a chance to win, you need {ADDRESS.DEPOSITTOKEN.SYMBOL} tokens.</p>
      ) : (
        <>
          {hasDepositTokens && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
              <p className="flex items-center flex-wrap mb-2 sm:mb-0">
                <span className="mr-2">You have</span>
                <Image
                  src={ADDRESS.DEPOSITTOKEN.ICON}
                  alt={`${ADDRESS.DEPOSITTOKEN.SYMBOL} Icon`}
                  width={20}
                  height={20}
                  className="inline-block mr-1"
                />
                <span className="mr-2">
                  {ParseDepositTokenAmount(userData?.UserDepositTokens, true)} {ADDRESS.DEPOSITTOKEN.SYMBOL}
                </span>
                <span>you can deposit</span>
              </p>
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="text-[16px] py-[2px] px-[12px] rounded-[14px] border-none bg-[#2A2A5B] text-[#FFFCFC] cursor-pointer hover:bg-[#27aee3] transition-all"
              >
                Deposit
              </button>
              <DepositModal
                isOpen={isDepositModalOpen}
                onClose={() => {setIsDepositModalOpen(false); onDataUpdate();}}
              />
            </div>
          )}
          {hasVaultTokens && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
              <p className="flex items-center flex-wrap mb-2 sm:mb-0">
                <span className="mr-2">You have</span>
                <Image
                  src={ADDRESS.VAULT.ICON}
                  alt={`${ADDRESS.VAULT.SYMBOL} Icon`}
                  width={20}
                  height={20}
                  className="inline-block mr-1"
                />
                <span className="mr-2">
                  {ParseVaultAmount(userData?.UserVaultTokens, true)} {ADDRESS.VAULT.SYMBOL}
                </span>
                <span>tickets to win</span>
              </p>
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="text-[16px] py-[2px] px-[12px] rounded-[14px] border-none bg-[#2A2A5B] text-[#FFFCFC] cursor-pointer hover:bg-[#27aee3] transition-all"
              >
                Withdraw
              </button>
              <WithdrawModal
                isOpen={isWithdrawModalOpen}
                onClose={() => {setIsWithdrawModalOpen(false); onDataUpdate();}}
              />
            </div>
          )}
          
          {rewardsData && rewardsData[0]?.amounts?.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
              <p className="flex items-center flex-wrap mb-2 sm:mb-0">
                <span className="mr-2">You have</span>
                <Image 
                  src={REWARDS[0].IMAGE} 
                  alt={REWARDS[0].SYMBOL}
                  width={20} 
                  height={20}
                  className="inline-block mr-1"
                />
                <span className="mr-2">
                  {CropDecimals(formatBigIntWithDecimals(sumBigInts(rewardsData[0].amounts), REWARDS[0].DECIMALS))} {REWARDS[0].SYMBOL}
                </span>
                <span>rewards to claim</span>
              </p>
              <button
                onClick={() => {/* Add claim function here */}}
                className="text-[16px] py-[2px] px-[12px] rounded-[14px] border-none bg-[#2A2A5B] text-[#FFFCFC] cursor-pointer hover:bg-[#27aee3] transition-all"
              >
                Claim
              </button>
            </div>
          )}

          {userChance && userChance.grandPrize.userTwab > BigInt(0) && (
            <div className="mt-4">
              {(() => {
                const chancePercentage = Number(userChance.grandPrize.userTwab) / Number(userChance.grandPrize.totalTwab) *( Number(userChance.grandPrize.vaultPortion)/1e18) * 100;
                const oddsOfWinning = Math.round(100 / chancePercentage);
                return (
                  <p className="text-sm">Your odds of winning the GP are 1 in {oddsOfWinning.toLocaleString()}</p>
                );
              })()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

function sumBigInts(bigints: bigint[]): bigint {
  return bigints.reduce((sum, amount) => sum + amount, BigInt(0));
}

function formatBigIntWithDecimals(value: bigint, decimals: number): string {
  const valueString = value.toString().padStart(decimals + 1, '0');
  const integerPart = valueString.slice(0, -decimals);
  const fractionalPart = valueString.slice(-decimals);
  const trimmedFractionalPart = fractionalPart.replace(/0+$/, '');
  
  if (trimmedFractionalPart) {
    return `${integerPart}.${trimmedFractionalPart}`;
  } else {
    return integerPart;
  }
}

export default UserInfo;
