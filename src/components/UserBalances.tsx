// components/UserBalances.tsx
import { useEffect, useState } from 'react';
import { getUser } from '../fetch/getUser';
import { useAccount } from 'wagmi';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';

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

  const fetchUserData = async () => {
    if (!address) return;

    try {
      const data = await getUser(address);
      setUserData(data);
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
  if (loading) return <div>Loading User Data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>User Data</h2>
      <p>User Deposit Tokens: {userData?.UserDepositTokens.toString() || 'N/A'} USDC</p>
      <button 
        onClick={() => setIsDepositModalOpen(true)} 
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
      >
        Open Deposit Modal
      </button>
      <DepositModal 
        isOpen={isDepositModalOpen} 
        onClose={() => setIsDepositModalOpen(false)} 
        onSuccess={fetchUserData}
      />
      <p>User Allowance: {userData?.UserAllowance.toString() || 'N/A'} USDC</p>
      <p>User Vault Tokens: {userData?.UserVaultTokens.toString() || 'N/A'}</p>
      <button 
        onClick={() => setIsWithdrawModalOpen(true)} 
        className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
        disabled={!userData || userData.UserVaultTokens.toString() === '0'}
      >
        Open Withdraw Modal
      </button>
      <WithdrawModal 
        isOpen={isWithdrawModalOpen} 
        onClose={() => setIsWithdrawModalOpen(false)} 
        onSuccess={fetchUserData}
      />
    </div>
  );
};

export default UserBalances;