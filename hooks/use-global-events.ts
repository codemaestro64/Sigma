'use client';

import { useEffect } from 'react';
import { usePublicClient, useWatchContractEvent } from 'wagmi';
import { FAIR_LAUNCH_ADDRESS } from '@/lib/contracts/addresses';
import { useTokenStore } from '@/lib/store/token-store';
import { fetchTokenMetadata } from '@/lib/utils/token';
import { formatEther, parseEther } from 'viem';
import { FAIR_LAUNCH_ABI } from '@/lib/contracts/abi-types';

export function useGlobalEvents() {
  const publicClient = usePublicClient();
  const { addToken, updatePrice } = useTokenStore();

  useWatchContractEvent({
    address: FAIR_LAUNCH_ADDRESS,
    abi: FAIR_LAUNCH_ABI,
    eventName: 'TokensBought',
    onLogs: async (logs) => {
      for (const log of logs) {
        if (!log.args) continue;
        
        const tokenAddress = log.args.tokenAddress || log.args[0];
        const buyer = log.args.buyer || log.args[1];
        const amount = log.args.amount || log.args[2];
        const ethSpent = log.args.ethSpent || log.args[3];

        if (!tokenAddress) continue;

        try {
          const result = await publicClient.readContract({
            address: FAIR_LAUNCH_ADDRESS,
            abi: FAIR_LAUNCH_ABI,
            functionName: 'getEthOut',
            args: [tokenAddress, parseEther('1')],
          });

          const [, ethBeforeFee] = result as [bigint, bigint];
          const formattedPrice = formatEther(ethBeforeFee);
          updatePrice(tokenAddress, formattedPrice);
        } catch (error) {
          console.error('Error updating price:', error);
        }
      }
    },
  });

  useWatchContractEvent({
    address: FAIR_LAUNCH_ADDRESS,
    abi: FAIR_LAUNCH_ABI,
    eventName: 'TokensSold',
    onLogs: async (logs) => {
      for (const log of logs) {
        if (!log.args) continue;
        
        const tokenAddress = log.args.tokenAddress || log.args[0];
        const seller = log.args.seller || log.args[1];
        const amount = log.args.amount || log.args[2];
        const ethReceived = log.args.ethReceived || log.args[3];

        if (!tokenAddress) continue;

        try {
          const result = await publicClient.readContract({
            address: FAIR_LAUNCH_ADDRESS,
            abi: FAIR_LAUNCH_ABI,
            functionName: 'getEthOut',
            args: [tokenAddress, parseEther('1')],
          });

          const [, ethBeforeFee] = result as [bigint, bigint];
          const formattedPrice = formatEther(ethBeforeFee);
          updatePrice(tokenAddress, formattedPrice);
        } catch (error) {
          console.error('Error updating price:', error);
        }
      }
    },
  });

  return null;
} 