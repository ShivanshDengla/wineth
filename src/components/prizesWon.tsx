import React, { useEffect, useState } from 'react';
import { fetchPrizes } from '../fetch/getPrizesWon';
import { useAccount } from 'wagmi';

interface PrizeClaim {
  id: string;
  payout: string;
  timestamp: string;
  prizeVault: {
    id: string;
  };
}

const PrizesWon: React.FC = () => {
  const [prizeClaims, setPrizeClaims] = useState<PrizeClaim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllWins, setShowAllWins] = useState<boolean>(false);

  const { address, isConnected } = useAccount();

  useEffect(() => {
    const getPrizeClaims = async () => {
      if (!isConnected || !address) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchPrizes(address);
        setPrizeClaims(data);
      } catch (err) {
        console.error('Error fetching prize claims:', err);
        setError(`Failed to load prize claims: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    getPrizeClaims();
  }, [address, isConnected]);

  const totalPayout = prizeClaims.reduce((acc, claim) => acc + parseFloat(claim.payout) / 1e18, 0);

  if (!isConnected) return <div>Please connect your wallet to see prize claims.</div>;
  if (loading) return <div>Loading prize claims...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Prizes Won by {address}</h2>
      {prizeClaims.length > 0 ? (
        <div>
          <p>Total Won: {totalPayout.toFixed(4)} tokens</p>
          <button
            onClick={() => setShowAllWins(!showAllWins)}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          >
            {showAllWins ? 'Hide Details' : 'View All Wins'}
          </button>

          {showAllWins && (
            <ul>
              {prizeClaims.map((claim) => (
                <li key={claim.id}>
                  <strong>Prize Vault:</strong> {claim.prizeVault.id} | 
                  <strong> Payout:</strong> {(parseFloat(claim.payout) / 1e18).toFixed(4)} tokens | 
                  <strong> Timestamp:</strong> {new Date(parseInt(claim.timestamp) * 1000).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p>No prizes found for this user.</p>
      )}
    </div>
  );
};

export default PrizesWon;