// components/UserBalances.tsx
import { useEffect, useState } from 'react';
import { getUser } from '../fetch/getUser';
import { useAccount } from 'wagmi';

const UserBalances = () => {
  const { address } = useAccount();
  const [userData, setUserData] = useState<{
    UserDepositTokens: string;
    UserAllowance: string;
    UserVaultTokens: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <p>User Allowance: {userData?.UserAllowance || 'N/A'} USDC</p>
      <p>User Vault Tokens: {userData?.UserVaultTokens || 'N/A'}</p>
    </div>
  );
};

export default UserBalances;
