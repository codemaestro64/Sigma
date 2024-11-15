'use client';

import { useContractReads } from 'wagmi';
import { formatEther } from 'viem';
import { FAIR_LAUNCH_ERC20_TOKEN_ABI } from '@/lib/contracts/abi-types';

export function useTokenStats(tokenAddress: string) {
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        address: tokenAddress as `0x${string}`,
        abi: FAIR_LAUNCH_ERC20_TOKEN_ABI,
        functionName: 'totalSupply',
      },
      {
        address: tokenAddress as `0x${string}`,
        abi: FAIR_LAUNCH_ERC20_TOKEN_ABI,
        functionName: 'balanceOf',
        args: [tokenAddress as `0x${string}`],
      },
      {
        address: tokenAddress as `0x${string}`,
        abi: FAIR_LAUNCH_ERC20_TOKEN_ABI,
        functionName: 'teamTokens',
      },
      {
        address: tokenAddress as `0x${string}`,
        abi: FAIR_LAUNCH_ERC20_TOKEN_ABI,
        functionName: 'poolCreationThreshold',
      },
      {
        address: tokenAddress as `0x${string}`,
        abi: FAIR_LAUNCH_ERC20_TOKEN_ABI,
        functionName: 'vestingContractAddress',
      },
    ],
  });

  const totalSupply = data?.[0]?.result ? formatEther(data[0].result as bigint) : '0';
  const launchContractBalance = data?.[1]?.result ? formatEther(data[1].result as bigint) : '0';
  const teamTokens = data?.[2]?.result ? formatEther(data[2].result as bigint) : '0';
  const poolCreationThreshold = data?.[3]?.result ? formatEther(data[3].result as bigint) : '0';
  const vestingContractAddress = data?.[4]?.result as string;

  return {
    totalSupply,
    launchContractBalance,
    teamTokens,
    poolCreationThreshold,
    vestingContractAddress,
    isError,
    isLoading,
  };
}
