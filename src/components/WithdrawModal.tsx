import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits } from 'viem';
import { getUser } from '../fetch/getUser';
import { ADDRESS } from '../constants/address';
import { ABI } from '../constants/abi';
import Modal from './ModalContainer';
import Image from 'next/image';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { writeContract, data: withdrawHash, isPending: isWithdrawPending } = useWriteContract();

  const { isLoading: isWithdrawLoading, isSuccess: isWithdrawConfirmed } = useWaitForTransactionReceipt({
    hash: withdrawHash,
  });

  const { address } = useAccount();
  const [amount, setAmount] = useState<string>('');
  const [userBalances, setUserBalances] = useState<{
    UserDepositTokens: bigint;
    UserAllowance: bigint;
    UserVaultTokens: bigint;
  } | null>(null);
  const [error, setError] = useState<string>('');


  useEffect(() => {
    if (address) {
      getUserData();
    }
  }, [address]);

  const getUserData = async () => {
    try {
      const data = await getUser(address as string);
      setUserBalances(data);
    } catch (err) {
      setError('Failed to fetch user data.');
    }
  };

  const handleWithdraw = async () => {
    try {
      const amountAsNumber = parseFloat(amount);

      if (isNaN(amountAsNumber)) {
        setError('Invalid amount');
        return;
      }

      const withdrawAmount = BigInt(Math.floor(amountAsNumber * 10 ** 6)); // Assuming USDC has 6 decimals

      writeContract({
        address: ADDRESS.VAULT.ADDRESS,
        abi: ABI.USDCVAULT,
        functionName: 'withdraw',
        args: [withdrawAmount, address, address],
      });
    } catch (err) {
      setError('Failed to process the transaction.');
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-[#1e2a45] p-6 rounded-lg w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Withdraw USDC</h2>

        {isWithdrawConfirmed ? (
          <div className="text-center">
            <h2 className="mb-5">Withdrawal Successful!</h2>
            
            <p className="mb-4">Your tokens have been successfully withdrawn.</p>
            <button
              onClick={onClose}
              className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
            >
              Close
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
                <label htmlFor="amount" className="block mb-1 text-sm text-left">Amount:</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    id="amount"
                    className="w-full min-w-0 flex-1 bg-[#2A2A5B] border border-[#C0ECFF] rounded-l-lg py-2 px-2 sm:px-4 text-white focus:outline-none text-sm sm:text-base"
                    value={amount}
                    onChange={handleAmountChange}
                    disabled={isWithdrawPending || isWithdrawLoading}
                  />
                  <button
                    onClick={handleMaxClick}
                    className="bg-blue-500 text-white font-bold py-2 px-2 sm:px-4 rounded-r-lg hover:bg-blue-700 transition-all cursor-pointer text-sm sm:text-base whitespace-nowrap"
                    disabled={isWithdrawPending || isWithdrawLoading}
                  >
                    Max
                  </button>
                </div>
                {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
              </div>

              <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
                onClick={handleWithdraw}
                disabled={!!error || !amount || isWithdrawPending || isWithdrawLoading}
              >
                {isWithdrawPending || isWithdrawLoading ? "Withdrawing..." : "Withdraw"}
              </button>
            </div>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
        {isWithdrawLoading && (
          <div>
            Waiting for withdrawal confirmation... 
            {withdrawHash && (
              <a href={`${ADDRESS.BLOCKEXPLORER}/tx/${withdrawHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                [tx]
              </a>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default WithdrawModal;
