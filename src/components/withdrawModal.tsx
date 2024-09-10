import React, { useState, useEffect } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { getUser } from '../fetch/getUser';
import { ADDRESS } from '../constants/address';
import { ABI } from '../constants/abi';
import Modal from './Modal';
import { parseUnits } from 'viem';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { address, chain } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
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
    if (chain?.id !== 10) {
      setError('Please connect to the Optimism network.');
      return;
    }

    if (!walletClient) {
      setError('Wallet not connected.');
      return;
    }

    setIsProcessing(true);
    setError('');
    
    try {
      const amountAsNumber = parseFloat(amount);

      if (isNaN(amountAsNumber) || amountAsNumber <= 0) {
        throw new Error('Invalid amount');
      }

      const withdrawAmount = parseUnits(amount, 6); // Assuming USDC has 6 decimals

      if (userBalances && withdrawAmount > userBalances.UserVaultTokens) {
        throw new Error('Insufficient balance in vault');
      }

      // Estimate gas
      const gasEstimate = await publicClient.estimateContractGas({
        address: ADDRESS.USDCVAULT,
        abi: ABI.USDCVAULT,
        functionName: 'withdraw',
        args: [withdrawAmount, address, address],
        account: address,
      });

      // Proceed with withdrawal
      const hash = await walletClient.writeContract({
        address: ADDRESS.USDCVAULT,
        abi: ABI.USDCVAULT,
        functionName: 'withdraw',
        args: [withdrawAmount, address, address],
        gas: gasEstimate,
      });

      console.log('Withdrawal transaction submitted:', hash);
      
      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      if (receipt.status === 'success') {
        console.log('Withdrawal successful:', receipt);
        await getUserData(); // Refresh user balances after withdrawal
        onSuccess?.(); // Call onSuccess if provided
        onClose(); // Close the modal on success
      } else {
        throw new Error('Transaction failed');
      }

    } catch (err: any) {
      console.error('Withdrawal error:', err);
      setError(`Failed to process the transaction: ${err.message}`);
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

      const amountInBigInt = parseUnits(value, 6); // Assuming USDC has 6 decimals

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
      <div className="withdraw-modal p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Withdraw USDC</h2>
        {userBalances ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount:</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={amount}
                onChange={handleAmountChange}
                disabled={isProcessing}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <button
              className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300 disabled:opacity-50"
              onClick={handleWithdraw}
              disabled={!!error || isProcessing || !amount || chain?.id !== 10}
            >
              {isProcessing ? 'Processing...' : 'Withdraw'}
            </button>
          </>
        ) : (
          <p className="text-gray-600">Loading user data...</p>
        )}
        {chain?.id !== 10 && (
          <p className="text-red-500 mt-4">Please connect to the Optimism network to proceed.</p>
        )}
      </div>
    </Modal>
  );
};

export default WithdrawModal;