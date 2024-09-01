import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { getUser } from '../fetch/getUser';
import { ADDRESS } from '../constants/address';
import { ABI } from '../constants/abi';

import Modal from './modal';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { address, chain } = useAccount();  // Now includes chain information
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

  // Refresh user data when approval is confirmed
  useEffect(() => {
    if (isApproveConfirmed) {
      getUserData();
    }
  }, [isApproveConfirmed]);

  const handleApproveAndDeposit = async () => {
    if (chain?.id !== 10) {
      setError('Please connect to the Optimism network.');
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
          address: ADDRESS.USDC,
          abi: ABI.USDC,
          functionName: 'approve',
          args: [ADDRESS.USDCVAULT, depositAmount],
        });
      } else {
        try {
          // Proceed with deposit
          const depositTx = depositContract({
            address: ADDRESS.USDCVAULT,
            abi: ABI.USDCVAULT,
            functionName: 'deposit',
            args: [depositAmount, address],
          });
        
          const receipt = await depositTx.wait();
          if (receipt.status === 1) { // Transaction successful
            await getUserData(); // Refresh user balances after deposit
            onClose();
          }
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
      <div className="deposit-modal">
        <h2>Deposit USDC</h2>
        {userBalances ? (
          <>
            <div>
              <label>Amount:</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={amount}
                onChange={handleAmountChange}
                disabled={isProcessing || isApproveLoading || isDepositPending}
              />
              {error && <p className="error">{error}</p>}
            </div>
            <button
             className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
              onClick={handleApproveAndDeposit}
              disabled={!!error || isProcessing || !amount || isApproveLoading || isDepositPending || chain?.id !== 10}
            >
              {isProcessing ? 'Processing...' : buttonLabel}
            </button>
          </>
        ) : (
          <p>Loading...</p>
        )}
        {approveHash && <div>Approve Transaction Hash: {approveHash}</div>}
        {isApproveLoading && <div>Waiting for approval confirmation...</div>}
        {depositHash && <div>Deposit Transaction Hash: {depositHash}</div>}
        {isDepositLoading && <div>Waiting for deposit confirmation...</div>}
        {isDepositConfirmed && <div>Deposit confirmed.</div>}
        {chain?.id !== 10 && <p className="error">Please connect to the Optimism network to proceed.</p>}
      </div>
    </Modal>
  );
};

export default DepositModal;
