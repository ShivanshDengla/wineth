import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { getUser } from '../fetch/getUser';
import { ADDRESS } from '../constants/address';
import { ABI } from '../constants/abi';
import Modal from './Modal';
import Image from 'next/image';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositSuccess: () => void;  // New prop for handling successful deposits
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onDepositSuccess }) => {
  const { writeContract: approveContract, data: approveHash, isPending: isApprovePending } = useWriteContract();
  const { writeContract: depositContract, data: depositHash, isPending: isDepositPending } = useWriteContract();

  const { isLoading: isApproveLoading, isSuccess: isApproveConfirmed } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const { isLoading: isDepositLoading, isSuccess: isDepositConfirmed } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  
  const { address, chain } = useAccount();
  const [amount, setAmount] = useState<string>('');
  const [userBalances, setUserBalances] = useState<{
    UserDepositTokens: bigint;
    UserAllowance: bigint;
    UserVaultTokens: bigint;
  } | null>(null);
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (isDepositConfirmed) {
      onDepositSuccess();  // Call the onDepositSuccess callback when deposit is confirmed
      // Keep the modal open to show the success message
    }
  }, [isDepositConfirmed]);
  
  useEffect(() => {
    console.log("use effect triggered");
    if (address) {
      getUserData();
    }
  }, [address, isDepositConfirmed]);

  const getUserData = async () => {
    try {
      console.log("getUserData triggered",address);
      const data = await getUser(address as string);
      console.log("user data", data);
      setUserBalances(data);
    } catch (err) {
      setError('Failed to fetch user data.');
    }
  };

 
  useEffect(() => {
    if (isApproveConfirmed) {
      console.log('Approval confirmed, updating user data');
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
        console.log('Initiating approval transaction');
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

  const getButtonLabel = () => {
    if (isApprovePending || isApproveLoading) {
      return "APPROVING...";
    }
    if (isDepositPending || isDepositLoading) {
      return "DEPOSITING...";
    }
    if (userBalances && parseFloat(amount) > 0 && BigInt(Math.floor(parseFloat(amount) * 10 ** 6)) > userBalances.UserAllowance) {
      return "Approve";
    }
    return "Deposit";
  };

  const handleSwitchChain = async () => {
    try {
      await switchChain({ chainId: ADDRESS.CHAINID });
    } catch (error) {
      console.error('Failed to switch chain:', error);
      setError('Failed to switch network. Please try manually.');
    }
  };

  const handleMaxClick = () => {
    if (userBalances) {
      const maxAmount = Number(userBalances.UserDepositTokens) / 10 ** ADDRESS.DEPOSITTOKEN.DECIMALS;
      setAmount(maxAmount.toString());
      setError(''); // Clear any existing errors
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-[#1e2a45] p-6 rounded-lg w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Deposit USDC</h2>

        {chain?.id !== ADDRESS.CHAINID ? (
          <div className="mt-4">
            <p className="text-red-500">Please connect to the {ADDRESS.CHAINNAME} network to proceed.</p>
            <button
              onClick={handleSwitchChain}
              className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
            >
              Switch to {ADDRESS.CHAINNAME}
            </button>
          </div>
        ) : isDepositConfirmed ? (
          <div className="text-center">
            <h2 className="mb-5">Congratulations!</h2>
            <Image
              src="/images/deposit-success-transparent.png" // Make sure to add a celebration gif to your public folder
              alt="Celebration"
              width={150}
              height={150}
              className="mx-auto"
            />
            <br></br>
            <p className="mb-4">You have successfully deposited your tokens and are now building your chance to win!</p>
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
                  <Image
                    src={ADDRESS.DEPOSITTOKEN.ICON}
                    alt={`${ADDRESS.DEPOSITTOKEN.SYMBOL} Icon`}
                    width={24}
                    height={24}
                    className="mx-2"
                  />
                  <span className="whitespace-nowrap">
                    {Number(userBalances.UserDepositTokens) / 10 ** ADDRESS.DEPOSITTOKEN.DECIMALS} {ADDRESS.DEPOSITTOKEN.SYMBOL}
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
                    disabled={isProcessing || isApproveLoading || isDepositPending}
                  />
                  <button
                    onClick={handleMaxClick}
                    className="bg-blue-500 text-white font-bold py-2 px-2 sm:px-4 rounded-r-lg hover:bg-blue-700 transition-all cursor-pointer text-sm sm:text-base whitespace-nowrap"
                    disabled={isProcessing || isApproveLoading || isDepositPending}
                  >
                    Max
                  </button>
                </div>
                {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
              </div>

              <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
                onClick={handleApproveAndDeposit}
                disabled={!!error || isProcessing || !amount || isApproveLoading || isDepositPending || isApprovePending || isDepositLoading}
              >
                {getButtonLabel()}
              </button>
            </div>
          </>
        ) : (
          <></>
        )}
        {/* {approveHash && <div>Approve Transaction Hash: {approveHash}</div>} */}
        {isApproveLoading && (
          <div>
            Waiting for approval confirmation... 
            {approveHash && (
              <a href={`${ADDRESS.BLOCKEXPLORER}/tx/${approveHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                [tx]
              </a>
            )}
          </div>
        )}
        {isDepositLoading && (
          <div>
            Waiting for deposit confirmation... 
            {depositHash && (
              <a href={`${ADDRESS.BLOCKEXPLORER}/tx/${depositHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                [tx]
              </a>
            )}
          </div>
        )}
        {/* {isDepositConfirmed && <div>Deposit confirmed.</div>} */}
      </div>
    </Modal>
  );
};

export default DepositModal;
