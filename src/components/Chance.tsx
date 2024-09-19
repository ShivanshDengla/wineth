// components/Prizes.tsx
import { useEffect, useState } from "react";
import { GetChance } from "../fetch/getChance";
import { useAccount } from "wagmi";

// Define the type of the return data from GetChance
import type { ChanceResult } from "../fetch/getChance"; // Assuming the type is exported

const Chance = () => {
  const { address } = useAccount();
  const [data, setData] = useState<ChanceResult | null>(null); // Set type for data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChance = async () => {
      if (address) {
        try {
          const chance = await GetChance(address);
          if (chance !== null) {
            setData(chance); // No need for `as any` casting, data is properly typed
          } else {
            setError("Failed to fetch pooler chance");
          }
        } catch (err: any) {
          setError(`Failed to fetch pooler chance: ${err.message}`);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchChance();
  }, [address]);

  if (loading) return <div>Loading Chance...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data && data.grandPrize.vaultPortion && (
        <>GP chance: {data.grandPrize.vaultPortion.toString()}</>
      )}
    </div>
  );
};

export default Chance;
