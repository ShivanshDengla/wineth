// components/Prizes.tsx
import { useEffect, useState } from "react";
import { getPrizes } from "../fetch/getPrizes";
// import PrizeValue from "./PrizeValue";
import ParsePrizeAmount from "../utilities/ParsePrizeAmount";

interface PrizeData {
  accountedBalance: bigint;
  grandPrizeLiquidity: bigint;
}

const Prizes = () => {
  const [data, setData] = useState<PrizeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const prizeData = await getPrizes();
        if (prizeData !== null) {
          // todo typing force
          setData(prizeData as any);
        } else {
          setError("Failed to fetch prize data");
        }
      } catch (err: any) {
        setError(`Failed to fetch prize data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPrizes();
  }, []);

  // const formatToEth = (value: bigint | null) => {
  //   if (value === null) return 'N/A';
  //   return (Number(value) / 1e18).toFixed(4); // Converting bigint to number for display
  // };

  if (loading) return <div>Loading Prizes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.accountedBalance && (
        <p>
          Prizes: <ParsePrizeAmount amount={data.accountedBalance} /> 
        </p>
      )}
      {data?.grandPrizeLiquidity && (
        <p>
          Grand Prize: {" "}
          <ParsePrizeAmount amount={data?.grandPrizeLiquidity} /> 
        </p>
      )}
    </div>
  );
};

export default Prizes;
