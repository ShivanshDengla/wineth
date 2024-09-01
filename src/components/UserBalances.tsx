// components/UserBalances.tsx
import { useEffect, useState } from 'react';
import { getUser } from '../fetch/getUser';
import { useAccount } from 'wagmi';
import DepositModal from '../components/depositModal';


const UserBalances = () => {
  const { address } = useAccount();
  const [userData, setUserData] = useState<{
    UserDepositTokens: string;
    UserAllowance: string;
    UserVaultTokens: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
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

    fetchUserData();
  }, [address]);

  if (!address) return <div>Please connect your wallet to see user data.</div>;
  if (loading) return <div>Loading User Data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>User Data</h2>
      <p>User Deposit Tokens: {userData?.UserDepositTokens || 'N/A'} USDC</p>
      <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
        Open Deposit Modal</button>
      <DepositModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <p>User Allowance: {userData?.UserAllowance || 'N/A'} USDC</p>
      <p>User Vault Tokens: {userData?.UserVaultTokens || 'N/A'}</p>
    </div>
  );
};

export default UserBalances;
