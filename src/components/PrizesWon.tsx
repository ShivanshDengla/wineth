import React, { useEffect, useState } from "react";
import { fetchPrizes } from "../fetch/getPrizesWon";
import { useAccount } from "wagmi";
// import  PrizeValue  from './PrizeValue'
import { ParsePrizeAmount } from "../utilities/ParseAmounts";
import { ADDRESS } from "../constants/address";
import PrizeTokenIcon from "./PrizeTokenIcon";

interface PrizeClaim {
  id: string;
  payout: string;
  timestamp: string;
  prizeVault: {
    id: string;
  };
  txHash: string;
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
        console.error("Error fetching prize claims:", err);
        setError(`Failed to load prize claims: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    getPrizeClaims();
  }, [address, isConnected]);

  const totalPayout = prizeClaims.reduce(
    (acc, claim) => acc + parseFloat(claim.payout),
    0
  );

  if (!isConnected)
    return <></>;
  if (loading) return 
  <div>
    {/* Loading prize claims... */}
  </div>;
  if (error) return <></>;

  return (
    <div>
      
      {prizeClaims.length > 0 ? (
          <div className="flex items-center mt-6 justify-center bg-[#28447A] border-2 border-[#C0ECFF] rounded-lg p-4 text-white text-lg sm:text-base md:text-lg w-[340px] h-[60px]">
          <>
          <div className="font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent relative">
            YOU WON
            </div>
            
            &nbsp;<PrizeTokenIcon size={24}/>&nbsp;{ParsePrizeAmount(BigInt(totalPayout))}

            </>
          {/* <button
            onClick={() => setShowAllWins(!showAllWins)}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            {showAllWins ? "Hide Details" : "View All Wins"}
          </button> */}

          {showAllWins && (
            <ul>
              {prizeClaims.map((claim) => (
                <li key={claim.id}>
                  {/* <strong>Prize Vault:</strong> {claim.prizeVault.id} |  */}
                  <strong> Payout:</strong>{" "}
                  {ParsePrizeAmount(BigInt(claim.payout))} |
                  <a href={`${ADDRESS.BLOCKEXPLORER}/tx/${claim.txHash}`}>
                    <strong>Timestamp:</strong>{" "}
                    {new Date(
                      parseInt(claim.timestamp) * 1000
                    ).toLocaleString()}
                  </a>
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
