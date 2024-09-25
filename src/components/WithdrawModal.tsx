import React, { useState, useEffect } from 'react';
import { useAccount, usePublicClient, useWalletClient, useSwitchChain } from 'wagmi';
import { getUser } from '../fetch/getUser';
import { ADDRESS } from '../constants/address';
import { ABI } from '../constants/abi';
import Modal from './Modal';
import { parseUnits, formatUnits } from 'viem';
import Image from 'next/image';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { address, chain } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { switchChain } = useSwitchChain();

  const [amount, setAmount] = useState<string>('');
  const [userBalances, setUserBalances] = useState<{
    UserDepositTokens: bigint;
    UserAllowance: bigint;
    UserVaultTokens: bigint;
  } | null>(null);
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [withdrawHash, setWithdrawHash] = useState<string | null>(null);
  const [isWithdrawPending, setIsWithdrawPending] = useState<boolean>(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState<boolean>(false);
  const [isWithdrawConfirmed, setIsWithdrawConfirmed] = useState<boolean>(false);
  const [isSwitchingChain, setIsSwitchingChain] = useState<boolean>(false);

  useEffect(() => {
    if (address && chain?.id === ADDRESS.CHAINID) {
      getUserData();
    }
  }, [address, chain]);

  const getUserData = async () => {
    if (!address) return;
    try {
      const data = await getUser(address);
      setUserBalances(data);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError('Failed to fetch user data.');
    }
  };

  const handleWithdraw = async () => {
    if (!walletClient || !address || !amount) return;
    setIsProcessing(true);
    setError('');
    setIsWithdrawPending(true);
    setIsWithdrawLoading(true);

    try {
      const amountInWei = parseUnits(amount, ADDRESS.VAULT.DECIMALS);
      if (!publicClient) {
        throw new Error("Public client is not initialized");
      }
      const { request } = await publicClient.simulateContract({
        address: ADDRESS.VAULT.ADDRESS,
        abi: ABI.USDCVAULT,
        functionName: 'withdraw',
        args: [amountInWei, address, address],
        account: address,
      });

      const hash = await walletClient.writeContract(request);
      setWithdrawHash(hash);
      setIsWithdrawPending(false);

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status === 'success') {
        setIsWithdrawConfirmed(true);
        getUserData();
        if (onSuccess) onSuccess();
      } else {
        setError('Withdraw failed. Please try again.');
      }
    } catch (err) {
      console.error('Withdraw error:', err);
      setError('An error occurred during withdrawal. Please try again.');
    } finally {
      setIsProcessing(false);
      setIsWithdrawLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value);
      setError('');
    }
  };

  const handleMaxClick = () => {
    if (userBalances?.UserVaultTokens) {
      setAmount(formatUnits(userBalances.UserVaultTokens, ADDRESS.VAULT.DECIMALS));
    }
  };

  const handleSwitchChain = async () => {
    setIsSwitchingChain(true);
    try {
      await switchChain({ chainId: ADDRESS.CHAINID });
    } catch (error) {
      console.error('Failed to switch chain:', error);
      setError('Failed to switch network. Please try again.');
    } finally {
      setIsSwitchingChain(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-[#1e2a45] p-6 rounded-lg w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Withdraw USDC</h2>

        {chain?.id !== ADDRESS.CHAINID ? (
          <div className="mt-4">
            <p className="text-red-500">Please connect to the {ADDRESS.CHAINNAME} network to proceed.</p>
            <button
              onClick={handleSwitchChain}
              disabled={isSwitchingChain}
              className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSwitchingChain ? 'Switching...' : `Switch to ${ADDRESS.CHAINNAME}`}
            </button>
          </div>
        ) : userBalances ? (
          <>
            <div className="flex flex-col space-y-4">
              {/* Display Current Balances */}
              <div className="flex items-center justify-between">
                <p className="flex items-center">
                  You have 
                  <span className="mx-2 relative w-6 h-6">
                    <Image
                      src={ADDRESS.VAULT.ICON}
                      alt={`${ADDRESS.VAULT.SYMBOL} Icon`}
                      layout="fill"
                      objectFit="contain"
                    />
                  </span>
                  <span className="whitespace-nowrap">
                    {formatUnits(userBalances.UserVaultTokens, ADDRESS.VAULT.DECIMALS)} {ADDRESS.VAULT.SYMBOL}
                  </span>
                </p>
              </div>

              {/* Input and Buttons */}
              <div>
                <label htmlFor="amount" className="block mb-1 text-sm">Amount:</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    id="amount"
                    className="flex-grow bg-[#2A2A5B] border border-[#C0ECFF] rounded-l-lg py-2 px-4 text-white focus:outline-none"
                    value={amount}
                    onChange={handleAmountChange}
                    disabled={isProcessing || isWithdrawPending}
                  />
                  <button
                    onClick={handleMaxClick}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-r-lg hover:bg-blue-700 transition-all cursor-pointer"
                    disabled={isProcessing || isWithdrawPending}
                  >
                    Max
                  </button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>

              <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleWithdraw}
                disabled={!!error || isProcessing || !amount || isWithdrawPending || isWithdrawLoading}
              >
                {isWithdrawPending || isWithdrawLoading ? "WITHDRAWING..." : "Withdraw"}
              </button>
            </div>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
        {isWithdrawLoading && (
          <div className="mt-4">
            Waiting for withdrawal confirmation... 
            {withdrawHash && (
              <a href={`${ADDRESS.BLOCKEXPLORER}/tx/${withdrawHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                [tx]
              </a>
            )}
          </div>
        )}
        {isWithdrawConfirmed && <div className="mt-4 text-green-500">Withdrawal confirmed.</div>}
      </div>
    </Modal>
  );
};

export default WithdrawModal;

