import { formatUnits } from "viem";
import { ADDRESS } from "../constants/address"

// Helper Functions
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

function Dec(number: bigint, decimals: number): string {
  return formatUnits(number, decimals);
}

// 1. Parse Deposit Token Amount
export function ParseDepositTokenAmount(amount: bigint = BigInt(0), rounded: boolean = false): string {
  const DepositTokenDecimals = ADDRESS.VAULT.DECIMALS; // Assuming deposit token has 18 decimals

  const formatToken = (num: bigint) => {
    const tokenValue = Dec(num, DepositTokenDecimals);
    if (rounded) {
      return CropDecimals(tokenValue, true);
    } else {
      return NumberWithCommas(CropDecimals(tokenValue));
    }
  };

  return formatToken(amount);
}

// 2. Parse Prize Token Amount
export function ParsePrizeAmount(amount: bigint = BigInt(0), rounded: boolean = false): string {
  const PrizeTokenDecimals = ADDRESS.PRIZETOKEN.DECIMALS; // Assuming prize token has 6 decimals

  const formatToken = (num: bigint) => {
    const tokenValue = Dec(num, PrizeTokenDecimals);
    if (rounded) {
      return CropDecimals(tokenValue, true);
    } else {
      return NumberWithCommas(CropDecimals(tokenValue));
    }
  };

  return formatToken(amount);
}

// 3. Parse Vault Token Amount
export function ParseVaultAmount(amount: bigint = BigInt(0), rounded: boolean = false): string {
  const VaultTokenDecimals = ADDRESS.VAULT.DECIMALS; // Assuming vault token has 8 decimals

  const formatToken = (num: bigint) => {
    const tokenValue = Dec(num, VaultTokenDecimals);
    if (rounded) {
      return CropDecimals(tokenValue, true);
    } else {
      return NumberWithCommas(CropDecimals(tokenValue));
    }
  };

  return formatToken(amount);
}
