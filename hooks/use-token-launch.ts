'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { FAIR_LAUNCH_TOKEN_FACTORY_ABI } from '@/lib/contracts/FairLaunchTokenFactory';
import { FAIR_LAUNCH_TOKEN_FACTORY_ADDRESS } from '@/lib/contracts/addresses';
import { pinata } from '@/lib/pinata';

export function useTokenLaunch() {
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);
  const { address: walletAddress, isConnected } = useAccount();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const { writeContractAsync, isPending: isWritePending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const launchToken = async ({
    name,
    symbol,
    description,
    website,
    socials,
    additionalLinks,
    icon,
    enableFaucet,
    enableBundleFirstBuy,
  }: {
    name: string;
    symbol: string;
    description: string;
    website: string;
    socials: { twitter?: string; telegram?: string; discord?: string };
    additionalLinks?: { name: string; url: string }[];
    icon?: string;
    enableFaucet: boolean;
    enableBundleFirstBuy: boolean;
  }) => {
    if (!isConnected || !walletAddress || !writeContractAsync) {
      throw new Error('Wallet not connected or write contract not available');
    }

    try {
      // Create metadata object
      const metadata = {
        name,
        symbol,
        description,
        website,
        socials,
        additionalLinks,
        icon,
        enableFaucet,
        enableBundleFirstBuy,
        creationTimestamp: Math.floor(Date.now() / 1000),
      };

      // Upload metadata to IPFS
      const metadataResult = await pinata.pinJSONToIPFS(metadata);
      const metadataHash = metadataResult.IpfsHash;

      // Call the smart contract with the IPFS hash
      const config = {
        address: FAIR_LAUNCH_TOKEN_FACTORY_ADDRESS,
        abi: FAIR_LAUNCH_TOKEN_FACTORY_ABI,
        functionName: 'createNewToken',
        args: [name, symbol, walletAddress, metadataHash],
      } as const;

      const hash = await writeContractAsync(config);
      setTxHash(hash);

    } catch (error: any) {
      console.error('Error launching token:', error);
      if (error.message?.includes('User rejected the request')) {
        console.log('Transaction rejected by user');
        return;
      }
      throw error;
    }
  };

  return {
    launchToken,
    isConfirming: isWritePending || isConfirming,
    isSuccess,
    tokenAddress,
    walletAddress,
    isConnected,
  };
}
