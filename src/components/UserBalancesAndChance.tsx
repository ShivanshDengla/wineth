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

const UserBalances = () => {
  const { address } = useAccount();
  const [userData, setUserData] = useState<{
    UserDepositTokens: bigint;
    UserAllowance: bigint;
    UserVaultTokens: bigint;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [userChance, setUserChance] = useState<ChanceResult | null>(null);

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

  useEffect(() => {
    fetchUserData();
  }, [address]);

  if (!address) return <div>Please connect your wallet to see user data.</div>;
  if (loading) return 
  <div>
    {/* Loading User Data... */}
    </div>;
  if (error) return 
  <div>
    {/* Error: {error} */}
    </div>;

  const hasDepositTokens = userData?.UserDepositTokens && userData.UserDepositTokens > BigInt(0);
  const hasVaultTokens = userData?.UserVaultTokens && userData.UserVaultTokens > BigInt(0);

  return (
    <div className="flex flex-col items-start py-4 px-6 mt-6 text-white text-lg w-full md:w-auto bg-[#28447A] border-l-2 border-r-2 border-[#C0ECFF] space-y-4">
      {!hasDepositTokens && !hasVaultTokens ? (
        <p>Welcome winner! For a chance to win, you need {ADDRESS.DEPOSITTOKEN.SYMBOL} tokens.</p>
      ) : (
        <>
          {hasDepositTokens && (
            <div className="flex justify-between items-center w-full">
              <p className="flex items-center">
               
                You have <Image
                  src={ADDRESS.DEPOSITTOKEN.ICON}
                  alt={`${ADDRESS.DEPOSITTOKEN.SYMBOL} Icon`}
                  width={20}
                  height={20}
                  className="inline-block mr-1 ml-2"
                />
                {ParseDepositTokenAmount(userData?.UserDepositTokens, true)}{" "}
                {ADDRESS.DEPOSITTOKEN.SYMBOL} you can deposit
              </p>
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="text-[16px] py-[2px] px-[12px] ml-3 rounded-[14px] border-none bg-[#2A2A5B] text-[#FFFCFC] cursor-pointer hover:bg-[#27aee3] transition-all"
              >
                Deposit
              </button>
              <DepositModal
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
                onSuccess={fetchUserData}
              />
            </div>
          )}
          {hasVaultTokens && (
            <div className="flex justify-between items-center w-full">
              <p className="flex items-center">
                
                You have<Image
                  src={ADDRESS.VAULT.ICON}
                  alt={`${ADDRESS.VAULT.SYMBOL} Icon`}
                  width={20}
                  height={20}
                  className="inline-block mr-1 ml-2"
                />
                {ParseVaultAmount(userData?.UserVaultTokens, true)} {ADDRESS.VAULT.SYMBOL} tickets to win
              </p>
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="text-[16px] py-[2px] px-[12px] ml-3 rounded-[14px] border-none bg-[#2A2A5B] text-[#FFFCFC] cursor-pointer hover:bg-[#27aee3] transition-all"
              >
                Withdraw
              </button>
              <WithdrawModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                onSuccess={fetchUserData}
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
                    {/* <p>Grand prize chance: {chancePercentage.toFixed(2)}%</p> */}
                    <p>Your odds of winning the GP are 1 in {oddsOfWinning.toLocaleString()}</p>
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

export default UserBalances;
