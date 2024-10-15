import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { ADDRESS } from '../constants/address'
import { ABI } from '../constants/abi';
import { RewardsData } from '../fetch/getRewards';

interface RewardsClaimProps {
  data: RewardsData[]; // Define the type for the data prop
}
const RewardsClaim: React.FC<RewardsClaimProps> = ({ data }) => {
    const { writeContract: claim, data: claimHash, isPending: isClaimPending } = useWriteContract();
  
    const { isLoading: isClaimLoading, isSuccess: isClaimConfirmed } = useWaitForTransactionReceipt({
      hash: claimHash,
    });
  
 
  
    const { switchChain } = useSwitchChain();

    const { address, chain } = useAccount();
    const handleClaim = async () => {
        console.log("claiming")
        if (chain?.id !== ADDRESS.CHAINID) {
            console.log("wropng chain")

            await switchChain({ chainId: ADDRESS.CHAINID });

          }else {
            console.log("right chain")
         // Get the first rewardsData object
      const reward = data[0];
      if (!reward) return;

      // Filter the epochs where the amount is greater than 0
      const validEpochs = reward.epochs.filter((_, index) => reward.amounts[index] > BigInt(0));

      // If there are valid epochs to claim, proceed with the claim
      if (validEpochs.length > 0) {
        claim({
          address: ADDRESS.TWABREWARDS,
          abi: ABI.TWABREWARDS,
          functionName: 'claimRewards',
          args: [address, reward.promotion, validEpochs], // Pass the filtered epochs and promotion
        });
      }
          }
    }
    return (
    
              <button
                onClick={handleClaim}
                className="text-[16px] py-[2px] px-[12px] rounded-[14px] border-none bg-[#2A2A5B] text-[#FFFCFC] cursor-pointer hover:bg-[#27aee3] transition-all"
              >
                Claim
              </button>
    )
}
 export default RewardsClaim