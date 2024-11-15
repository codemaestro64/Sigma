'use client';

import { useReadContracts } from 'wagmi';
import { formatEther } from 'viem';
import { FAIR_LAUNCH_ERC20_TOKEN_ABI, FAIR_LAUNCH_ABI } from '@/lib/contracts/abi-types';
import { FAIR_LAUNCH_ADDRESS } from '@/lib/contracts/addresses';

export function useMigrationProgress(tokenAddress: string) {
  const { data, isError, isLoading } = useReadContracts({
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
        args: [FAIR_LAUNCH_ADDRESS],
      },
      {
        address: tokenAddress as `0x${string}`,
        abi: FAIR_LAUNCH_ERC20_TOKEN_ABI,
        functionName: 'teamTokens',
      },
      {
        address: FAIR_LAUNCH_ADDRESS,
        abi: FAIR_LAUNCH_ABI,
        functionName: 'poolCreationThreshold',
      },
      {
        address: FAIR_LAUNCH_ADDRESS,
        abi: FAIR_LAUNCH_ABI,
        functionName: 'price',
      },
    ],
  });

  const totalSupply = data?.[0]?.result ? formatEther(data[0].result as bigint) : '0';
  const launchContractBalance = data?.[1]?.result ? formatEther(data[1].result as bigint) : '0';
  const teamTokens = data?.[2]?.result ? formatEther(data[2].result as bigint) : '0';
  const poolCreationThreshold = data?.[3]?.result ? formatEther(data[3].result as bigint) : '0';
  const price = data?.[4]?.result ? formatEther(data[4].result as bigint) : '0';

  const migrationProgress = isLoading || isError ? 0 : (() => {
    const totalSupplyNum = parseFloat(totalSupply);
    const teamTokensNum = parseFloat(teamTokens);
    const poolCreationThresholdNum = parseFloat(poolCreationThreshold);
    const launchContractBalanceNum = parseFloat(launchContractBalance);

    const tokensToMigrate = totalSupplyNum - teamTokensNum - poolCreationThresholdNum;
    const tokensMigrated = tokensToMigrate - (launchContractBalanceNum - poolCreationThresholdNum);

    return (tokensMigrated / tokensToMigrate) * 100;
  })();

  const remainingTokens = parseFloat(launchContractBalance) - parseFloat(poolCreationThreshold);

  return {
    migrationProgress,
    launchContractBalance,
    poolCreationThreshold,
    remainingTokens: remainingTokens.toString(),
    isError,
    isLoading,
  };
}
