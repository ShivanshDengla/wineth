import { useEffect, useState } from "react";
import { getUser } from "../fetch/getUser";
import { useAccount } from "wagmi";
import { ADDRESS } from "../constants/address";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";
import {
  ParseDepositTokenAmount,
  ParseVaultAmount,
} from "../utilities/ParseAmounts";
import { GetChance, ChanceResult } from "../fetch/getChance";
import Image from "next/image";

const UserBalancesAndChance: React.FC = () => {
  const { address } = useAccount();
  const [userData, setUserData] = useState<{
    UserDepositTokens: bigint;
    UserAllowance: bigint;
    UserVaultTokens: bigint;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false); // Only for deposit
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false); // Only for withdraw
  const [userChance, setUserChance] = useState<ChanceResult | null>(null);

  // Fetch user data
  const fetchUserData = async () => {
    if (!address) return;

    try {
      const data = await getUser(address);
      const chance: ChanceResult | null = await GetChance(address);
      setUserData(data);
      setUserChance(chance);
    } catch (err: any) {
      setError(`Failed to fetch user data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data whenever address changes
  useEffect(() => {
    fetchUserData();
  }, [address]);
console.log(isDepositModalOpen,"isDepositModalOpen")
console.log(isWithdrawModalOpen,"isWithdrawModalOpen")

  if (!address) return (
    <div className="flex flex-col items-center justify-center py-8 px-6 mt-6 text-white text-lg w-full md:w-auto bg-[#28447A] border-l-4 border-r-4 border-[#C0ECFF] rounded-lg shadow-md">
      <p className="text-xl font-semibold mb-4">Wallet Not Connected</p>
      <p>Please connect your wallet to see user data.</p>
    </div>
  );
  
  if (loading) return (
    <div className="flex items-center justify-center py-8 px-6 mt-6 text-white text-lg w-full md:w-auto bg-[#28447A] border-l-4 border-r-4 border-[#C0ECFF] rounded-lg shadow-md">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mr-3"></div>
      <p>Loading User Data...</p>
    </div>
  );
  
  if (error) return (
    <div className="flex flex-col items-center justify-center py-8 px-6 mt-6 text-white text-lg w-full md:w-auto bg-[#28447A] border-l-4 border-r-4 border-[#C0ECFF] rounded-lg shadow-md">
      <p className="text-xl font-semibold mb-4 text-red-400">Error</p>
      <p>{error}</p>
    </div>
  );

  const hasDepositTokens = userData?.UserDepositTokens && userData.UserDepositTokens > BigInt(0);
  const hasVaultTokens = userData?.UserVaultTokens && userData.UserVaultTokens > BigInt(0);

  return (
    <div className="flex flex-col items-start py-4 px-6 mt-6 text-white text-lg w-full md:w-auto bg-[#28447A] border-l-4 border-r-4 border-[#C0ECFF] space-y-4">
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
              </p>&nbsp;
              <button
                onClick={() => setIsDepositModalOpen(true)} // Only opens deposit modal
                className="text-[16px] py-[2px] px-[12px] rounded-[14px] border-none bg-[#2A2A5B] text-[#FFFCFC] cursor-pointer hover:bg-[#27aee3] transition-all"
              >
                Deposit
              </button>
              <DepositModal
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)} // Only closes deposit modal
                onDepositSuccess={() => {
                  fetchUserData(); // Only update user data, no modal interference
                }}
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
              </p>&nbsp;
              <button
                onClick={() => setIsWithdrawModalOpen(true)} // Only opens withdraw modal
                className="text-[16px] py-[2px] px-[12px] rounded-[14px] border-none bg-[#2A2A5B] text-[#FFFCFC] cursor-pointer hover:bg-[#27aee3] transition-all"
              >
                Withdraw
              </button>
              <WithdrawModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)} // Only closes withdraw modal
                onWithdrawSuccess={() => {
                  fetchUserData(); // Only update user data, no modal interference
                }}
              />
            </div>
          )}
          {userChance && userChance.grandPrize.userTwab > BigInt(0) && (
            <div className="mt-4">
              {(() => {
                const chancePercentage = Number(userChance.grandPrize.userTwab) / Number(userChance.grandPrize.totalTwab) * 100;
                const oddsOfWinning = Math.round(100 / chancePercentage);
                return (
                  <>
                    <p className="text-sm">Your odds of winning the GP are 1 in {oddsOfWinning.toLocaleString()}</p>
                  </>
                );
              })()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserBalancesAndChance;
