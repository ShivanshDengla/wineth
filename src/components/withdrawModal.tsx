import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { getUser } from '../fetch/getUser';
import { ADDRESS } from '../constants/address';
import { ABI } from '../constants/abi';
import Modal from './modal';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
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

  const { writeContract: withdrawContract, data: withdrawHash, isPending: isWithdrawPending } = useWriteContract();

  const { isLoading: isWithdrawLoading, isSuccess: isWithdrawConfirmed } = useWaitForTransactionReceipt({
    hash: withdrawHash,
  });

  const handleWithdraw = async () => {
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

      const withdrawAmount = BigInt(Math.floor(amountAsNumber * 10 ** 6)); // Assuming USDC has 6 decimals

      if (userBalances && withdrawAmount > userBalances.UserVaultTokens) {
        setError('Insufficient balance in vault');
        setIsProcessing(false);
        return;
      }

      // Proceed with withdrawal
      try {
        const withdrawTx = await withdrawContract({
          address: ADDRESS.USDCVAULT,
          abi: ABI.USDCVAULT,
          functionName: 'withdraw',  // Ensure this matches the contract method
          args: [withdrawAmount, address, address],
        });

        const receipt = await withdrawTx.wait();
        if (receipt.status === 1) { // Transaction successful
          await getUserData(); // Refresh user balances after withdrawal
          onClose(); // Close the modal on success
        } else {
          setError('Transaction failed.');
        }
      } catch (err) {
        setError('Failed to process the transaction.');
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

      if (userBalances && amountInBigInt > userBalances.UserVaultTokens) {
        setError('Insufficient balance in vault');
      } else {
        setError('');
      }

      setAmount(value);
    } catch (err) {
      setError('Invalid amount');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="withdraw-modal">
        <h2>Withdraw USDC</h2>
        {userBalances ? (
          <>
            <div>
              <label>Amount:</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={amount}
                onChange={handleAmountChange}
                disabled={isProcessing || isWithdrawPending}
              />
              {error && <p className="error">{error}</p>}
            </div>
            <button
              className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
              onClick={handleWithdraw}
              disabled={!!error || isProcessing || !amount || isWithdrawPending || chain?.id !== 10}
            >
              {isProcessing ? 'Processing...' : 'Withdraw'}
            </button>
          </>
        ) : (
          <p>Loading...</p>
        )}
        {withdrawHash && <div>Withdraw Transaction Hash: {withdrawHash}</div>}
        {isWithdrawLoading && <div>Waiting for withdrawal confirmation...</div>}
        {isWithdrawConfirmed && <div>Withdrawal confirmed.</div>}
        {chain?.id !== 10 && <p className="error">Please connect to the Optimism network to proceed.</p>}
      </div>
    </Modal>
  );
};

export default WithdrawModal;
