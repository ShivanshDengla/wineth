import React, { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { ADDRESS } from "../constants/address";
import { getTokenPrice } from "../fetch/getTokenPrice";

function NumberWithCommas(number: string) {
  const parts = number.split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
}

function CropDecimals(num: string | number, compact: boolean = false): string {
    const absNum = Math.abs(Number(num));
    if (absNum === 0 || isNaN(absNum)) {
        return "0";
    }

    function addCommas(x: number): string {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    if (compact) {
        if (absNum >= 1e6) {
            if (absNum < 1e8) {
                return (absNum / 1e6).toFixed(1) + "M";
            } else {
                return addCommas(Math.floor(absNum / 1e6)) + "M";
            }
        } else if (absNum >= 1e3) {
            return addCommas(Math.floor(absNum / 1e3)) + "k";
        } else if (absNum >= 100) {
            return addCommas(Math.floor(absNum));
        } else if (absNum >= 1) {
            return Number(absNum.toFixed(1)).toString();
        } else if (absNum >= 0.1) {
            return Number(absNum.toFixed(1)).toString();
        } else if (absNum >= 0.01) {
            return Number(absNum.toFixed(2)).toString();
        } else {
            return "<0.01";
        }
    } else {
        if (absNum > 99) {
            return addCommas(Math.floor(Number(num)));
        } else if (absNum >= 0.1) {
            return Number(num).toFixed(2);
        } else if (absNum >= 0.001) {
            return Number(num).toFixed(4);
        } else if (absNum >= 0.00001) {
            return Number(num).toFixed(6);
        } else if (absNum >= 0.000001) {
            return Number(num).toFixed(7);
        } else if (absNum >= 0.0000001) {
            return Number(num).toFixed(8);
        } else {
            return "DUST";
        }
    }
}

function Dec(number: bigint, decimals: number) {
  const formatted = formatUnits(number, decimals);
  return formatted;
}

interface DepositTokenAmtProps {
  amount?: bigint;
  size?: number;
  rounded?: boolean;
}

const ParseDepositTokenAmount: React.FC<DepositTokenAmtProps> = ({
  amount = BigInt(0),
  size = 16,
  rounded = false,
}) => {
  const [tokenPrice, setTokenPrice] = useState<number>(1);

  useEffect(() => {
    const fetchTokenPrice = async () => {
      try {
        const price = await getTokenPrice(ADDRESS.PRIZETOKEN.SYMBOL.toLowerCase());
        setTokenPrice(price);
      } catch (error) {
        console.error("Error fetching token price:", error);
      }
    };

    fetchTokenPrice();
  }, []);

  const DepositTokenDecimals = ADDRESS.PRIZETOKEN.DECIMALS;

  const formatToken = (num: bigint) => {
    const tokenValue = Dec(num, DepositTokenDecimals);

    if (rounded) {
      return `${CropDecimals(tokenValue, true)}`;
    } else {
      return `${NumberWithCommas(CropDecimals(tokenValue))}`;
    }
  };

  const formatInUSD = (num: bigint) => {
    const tokenValue = Dec(num, DepositTokenDecimals);
    const usdValue = parseFloat(tokenValue) * tokenPrice;

    if (rounded) {
      return `${CropDecimals(usdValue, true)}`;
    } else {
      return `${NumberWithCommas(CropDecimals(usdValue))}`;
    }
  };

  return (
    <span style={{ display: "inline-block", fontSize: size.toString() + "px" }}>
      {formatToken(amount)} {ADDRESS.PRIZETOKEN.SYMBOL} (${formatInUSD(amount)} USD)
    </span>
  );
};

export default ParseDepositTokenAmount;