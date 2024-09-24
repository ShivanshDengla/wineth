import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { getUser } from '../fetch/getUser';
import { ADDRESS } from '../constants/address';
import { ABI } from '../constants/abi';
import Modal from './Modal';
import Image from 'next/image';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { address, chain } = useAccount();
  const [amount, setAmount] = useState<string>('');
  const [userBalances, setUserBalances] = useState<{
    UserDepositTokens: bigint;
    UserAllowance: bigint;
    UserVaultTokens: bigint;
  } | null>(null);
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

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

  const { writeContract: approveContract, data: approveHash, isPending: isApprovePending } = useWriteContract();
  const { writeContract: depositContract, data: depositHash, isPending: isDepositPending } = useWriteContract();

  const { isLoading: isApproveLoading, isSuccess: isApproveConfirmed } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const { isLoading: isDepositLoading, isSuccess: isDepositConfirmed } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  useEffect(() => {
    if (isApproveConfirmed) {
      getUserData();
    }
  }, [isApproveConfirmed]);

  const handleApproveAndDeposit = async () => {
    if (chain?.id !== ADDRESS.CHAINID) {
      setError('Please connect to the ' + ADDRESS.CHAINNAME + ' network.');
      return;
    }

    setIsProcessing(true);
    try {
      const amountAsNumber = parseFloat(amount);

      if (isNaN(amountAsNumber)) {
        setError('Invalid amount');
        setIsProcessing(false);
        return;
      }

      const depositAmount = BigInt(Math.floor(amountAsNumber * 10 ** 6)); // Assuming USDC has 6 decimals

      if (userBalances && depositAmount > userBalances.UserAllowance) {
        // Trigger approval
        approveContract({
          address: ADDRESS.DEPOSITTOKEN.ADDRESS,
          abi: ABI.USDC,
          functionName: 'approve',
          args: [ADDRESS.VAULT.ADDRESS, depositAmount],
        });
      } else {
        try {
          // Proceed with deposit
          const depositTx = depositContract({
            address: ADDRESS.VAULT.ADDRESS,
            abi: ABI.USDCVAULT,
            functionName: 'deposit',
            args: [depositAmount, address],
          });
        } catch (err) {
          setError('Failed to process the transaction.');
        }
      }
    } catch (err) {
      setError('Failed to process the transaction.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    if (value === '') {
      setError('');
      setAmount('');
      return;
    }

    if (!/^\d*\.?\d*$/.test(value)) {
      setError('Invalid amount');
      return;
    }

    try {
      const amountAsNumber = parseFloat(value);

      if (isNaN(amountAsNumber)) {
        setError('Invalid amount');
        return;
      }

      const amountInBigInt = BigInt(Math.floor(amountAsNumber * 10 ** 6)); // Assuming USDC has 6 decimals

      if (userBalances && amountInBigInt > userBalances.UserDepositTokens) {
        setError('Insufficient balance');
      } else {
        setError('');
      }

      setAmount(value);
    } catch (err) {
      setError('Invalid amount');
    }
  };

  const buttonLabel = userBalances && parseFloat(amount) > 0 && BigInt(Math.floor(parseFloat(amount) * 10 ** 6)) > userBalances.UserAllowance
    ? 'Approve'
    : 'Deposit';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-[#1e2a45] p-6 rounded-lg w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Deposit USDC</h2>

        {userBalances ? (
          <>
            <div className="flex flex-col space-y-4">
              {/* Display Current Balances */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  
                  {/* <p>Your Vault Tokens: {userBalances.UserVaultTokens.toString()} {ADDRESS.VAULT.SYMBOL}</p> */}
                  <p>
                    You have <Image
                    src={ADDRESS.DEPOSITTOKEN.ICON}
                    alt={`${ADDRESS.DEPOSITTOKEN.SYMBOL} Icon`}
                    width={24}
                    height={24}
                    className="mr-2 ml-1"
                  />
                    {Number(userBalances.UserDepositTokens)/Math.pow(ADDRESS.DEPOSITTOKEN.DECIMALS,10)} {ADDRESS.DEPOSITTOKEN.SYMBOL} to deposit
                  </p>
                </div>
              </div>
              

              {/* Input and Buttons */}
              <div>
                <label htmlFor="amount" className="block mb-1 text-sm">Amount:</label>
                <input
                  type="text"
                  id="amount"
                  className="w-full bg-[#2A2A5B] border border-[#C0ECFF] rounded-lg py-2 px-4 text-white focus:outline-none"
                  value={amount}
                  onChange={handleAmountChange}
                  disabled={isProcessing || isApproveLoading || isDepositPending}
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>

              <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
                onClick={handleApproveAndDeposit}
                disabled={!!error || isProcessing || !amount || isApproveLoading || isDepositPending || chain?.id !== ADDRESS.CHAINID}
              >
                {isProcessing ? 'Processing...' : buttonLabel}
              </button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
        {approveHash && <div>Approve Transaction Hash: {approveHash}</div>}
        {isApproveLoading && <div>Waiting for approval confirmation...</div>}
        {depositHash && <div>Deposit Transaction Hash: {depositHash}</div>}
        {isDepositLoading && <div>Waiting for deposit confirmation...</div>}
        {isDepositConfirmed && <div>Deposit confirmed.</div>}
        {chain?.id !== ADDRESS.CHAINID && <p className="text-red-500">Please connect to the {ADDRESS.CHAINNAME} network to proceed.</p>}
      </div>
    </Modal>
  );
};

export default DepositModal;
