'use client';

import { useContractRead } from 'wagmi';
import { FAIR_TOKEN_ABI } from '@/lib/contracts/FairToken';

export function useTokenData(tokenAddress?: string) {
  const { data: name } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: FAIR_TOKEN_ABI,
    functionName: 'name',
    enabled: !!tokenAddress,
  });

  const { data: symbol } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: FAIR_TOKEN_ABI,
    functionName: 'symbol',
    enabled: !!tokenAddress,
  });

  const { data: decimals } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: FAIR_TOKEN_ABI,
    functionName: 'decimals',
    enabled: !!tokenAddress,
  });

  return {
    name: name as string,
    symbol: symbol as string,
    decimals: Number(decimals || 18),
    isLoading: !name || !symbol,
  };
}