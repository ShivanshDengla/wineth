import { CONTRACTS } from "../constants/contracts";
import { ADDRESS } from "../constants/address";
import { PROVIDER } from "../wagmi"; // Assuming this is where your provider is defined
import { Address } from "viem";
import { ABI } from "../constants/abi";

interface UserBalanceTotalSupplyTwab {
  twab: bigint;
  totalTwab: bigint;
}

export interface ChanceResult {
  grandPrize: {
    userTwab: bigint;
    totalTwab: bigint;
    vaultPortion: bigint;
  };
  firstTier: {
    userTwab: bigint;
    totalTwab: bigint;
    vaultPortion: bigint;
  };
  grandPrizeDuration: bigint;
  firstTierDuration: bigint;
  lastDrawId: bigint;
  numberOfTiers: bigint;
  estimatedNumberOfPrizes: number;
}

const estimateNumberOfPrizes = (numberOfTiers: bigint): number => {
  let prizes = 1;
  for (let i = 1; i < Number(numberOfTiers); i++) {
    prizes += Math.pow(4, i); // Prize count grows exponentially with each tier
  }
  return prizes;
};

export const GetChance = async (pooler: Address): Promise<ChanceResult | null> => {
  const vault = ADDRESS.VAULT.ADDRESS;

  // Define the prize pool contract
  const prizePoolContract = {
    address: ADDRESS.PRIZEPOOL,
    abi: ABI.PRIZEPOOL, // Make sure your ABI is defined here
  } as const;

  try {
    console.log("Fetching lastDrawId, grandPrizeDuration, firstTierDuration, and numberOfTiers...");

    // First multicall for fetching lastDrawId, grandPrizeDuration, firstTierDuration, and numberOfTiers
    const [lastDrawIdResult, grandPrizeDurationResult, firstTierDurationResult, numberOfTiersResult] = await PROVIDER.multicall({
      contracts: [
        {
          ...prizePoolContract,
          functionName: 'getLastAwardedDrawId',
        },
        {
          ...prizePoolContract,
          functionName: 'getTierAccrualDurationInDraws',
          args: [0], // Grand prize duration
        },
        {
          ...prizePoolContract,
          functionName: 'getTierAccrualDurationInDraws',
          args: [1], // First-tier duration
        },
        {
          ...prizePoolContract,
          functionName: 'numberOfTiers',
        },
      ],
    });

    // Extract the results from multicall
    const lastDrawId = BigInt(lastDrawIdResult.result as string);
    const grandPrizeDuration = BigInt(grandPrizeDurationResult.result as string);
    const firstTierDuration = BigInt(firstTierDurationResult.result as string);
    const numberOfTiers = BigInt(numberOfTiersResult.result as string);

    console.log("lastDrawId:", lastDrawId);
    console.log("grandPrizeDuration:", grandPrizeDuration);
    console.log("firstTierDuration:", firstTierDuration);
    console.log("numberOfTiers:", numberOfTiers);

    // Estimate the number of prizes based on the number of tiers
    const estimatedNumberOfPrizes = estimateNumberOfPrizes(numberOfTiers);
    console.log("Estimated Number of Prizes:", estimatedNumberOfPrizes);

    // Now calculate the draw starting points based on lastDrawId and durations
    const grandPrizeStartDraw =
      Math.max(0, Number(lastDrawId) - Number(grandPrizeDuration)) + 1;
    const firstTierStartDraw =
      Math.max(0, Number(lastDrawId) - Number(firstTierDuration)) + 1;

    console.log("grandPrizeStartDraw:", grandPrizeStartDraw);
    console.log("firstTierStartDraw:", firstTierStartDraw);

    // Second multicall for user balance and vault portions
    const [
      userGrandPrizeBalanceTotalSupplyTwabResult,
      userFirstTierBalanceTotalSupplyTwabResult,
      grandPrizeVaultPortionResult,
      firstTierVaultPortionResult,
    ] = await PROVIDER.multicall({
      contracts: [
        {
          ...prizePoolContract,
          functionName: 'getVaultUserBalanceAndTotalSupplyTwab',
          args: [vault, pooler, grandPrizeStartDraw, lastDrawId],
        },
        {
          ...prizePoolContract,
          functionName: 'getVaultUserBalanceAndTotalSupplyTwab',
          args: [vault, pooler, firstTierStartDraw, lastDrawId],
        },
        {
          ...prizePoolContract,
          functionName: 'getVaultPortion',
          args: [vault, grandPrizeStartDraw, lastDrawId],
        },
        {
          ...prizePoolContract,
          functionName: 'getVaultPortion',
          args: [vault, firstTierStartDraw, lastDrawId],
        },
      ],
    });

    // Extract twab and totalTwab from results
    const [userGrandPrizeTwab, grandPrizeTotalTwab] = userGrandPrizeBalanceTotalSupplyTwabResult.result as [bigint, bigint];
    const [userFirstTierTwab, firstTierTotalTwab] = userFirstTierBalanceTotalSupplyTwabResult.result as [bigint, bigint];

    const grandPrizeVaultPortion = BigInt(grandPrizeVaultPortionResult.result as string);
    const firstTierVaultPortion = BigInt(firstTierVaultPortionResult.result as string);

    console.log("userGrandPrizeTwab:", userGrandPrizeTwab);
    console.log("grandPrizeTotalTwab:", grandPrizeTotalTwab);
    console.log("userFirstTierTwab:", userFirstTierTwab);
    console.log("firstTierTotalTwab:", firstTierTotalTwab);
    console.log("grandPrizeVaultPortion:", grandPrizeVaultPortion);
    console.log("firstTierVaultPortion:", firstTierVaultPortion);

    // Return the calculated chance as bigints along with the estimated number of prizes
    return {
      grandPrize: {
        userTwab: userGrandPrizeTwab,
        totalTwab: grandPrizeTotalTwab,
        vaultPortion: grandPrizeVaultPortion,
      },
      firstTier: {
        userTwab: userFirstTierTwab,
        totalTwab: firstTierTotalTwab,
        vaultPortion: firstTierVaultPortion,
      },
      grandPrizeDuration,
      firstTierDuration,
      lastDrawId,
      numberOfTiers,
      estimatedNumberOfPrizes,
    };
  } catch (error) {
    console.error("Error fetching chance data:", error);
    return null;
  }
};
