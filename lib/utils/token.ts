import { FAIR_LAUNCH_ERC20_TOKEN_ABI } from '@/lib/contracts/abi-types';

export async function fetchTokenMetadata(publicClient: any, tokenAddress: string) {
  try {
    const metadataHash = await publicClient.readContract({
      address: tokenAddress as `0x${string}`,
      abi: FAIR_LAUNCH_ERC20_TOKEN_ABI,
      functionName: 'metadataHash',
    });

    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${metadataHash}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return {
      name: 'Unknown Token',
      symbol: 'UNKNOWN',
      icon: '/placeholder.png',
    };
  }
} 