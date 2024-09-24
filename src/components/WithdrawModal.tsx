import React, { useState, useEffect } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { getUser } from '../fetch/getUser';
import { ADDRESS } from '../constants/address';
import { ABI } from '../constants/abi';
import Modal from './Modal';
import { parseUnits, formatUnits } from 'viem';

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
    if (chain?.id !== ADDRESS.CHAINID) {
      setError('Please connect to the ' + ADDRESS.CHAINNAME + ' network.');
      return;
    }

    if (!walletClient) {
      setError('Wallet not connected.');
      return;
    }

    if (!publicClient) {
      setError('Public client not available.');
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
        address: ADDRESS.VAULT.ADDRESS,
        abi: ABI.USDCVAULT,
        functionName: 'withdraw',
        args: [withdrawAmount, address, address],
        account: address,
      });

      // Proceed with withdrawal
      const hash = await walletClient.writeContract({
        address: ADDRESS.VAULT.ADDRESS,
        abi: ABI.USDCVAULT,
        functionName: 'withdraw',
        args: [withdrawAmount, address, address],
        gas: gasEstimate,
      });

      console.log('Withdrawal transaction submitted:', hash);
      
      // Wait for transaction confirmation
      // TODO use wait for transaction
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
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Withdraw USDC</h2>
        {userBalances ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your vault balance:</span>
              <div className="flex items-center">
                <img src={ADDRESS.VAULT.ICON} alt="Vault Token" className="w-5 h-5 mr-2" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatUnits(userBalances.UserVaultTokens, ADDRESS.VAULT.DECIMALS)}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount:</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  className="block w-full pr-10 sm:text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300"
                  value={amount}
                  onChange={handleAmountChange}
                  disabled={isProcessing}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">USDC</span>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <button
              className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 cursor-pointer transition duration-300 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              onClick={handleWithdraw}
              disabled={!!error || isProcessing || !amount || chain?.id !== ADDRESS.CHAINID}
            >
              {isProcessing ? 'Processing...' : 'Withdraw'}
            </button>
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Loading user data...</p>
        )}
        {chain?.id !== ADDRESS.CHAINID && (
          <p className="text-red-500 mt-4">Please connect to the {ADDRESS.CHAINNAME} network to proceed.</p>
        )}
      </div>
    </Modal>
  );
};

export default WithdrawModal;