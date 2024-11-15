'use client';

import { useState, useEffect } from 'react';
import { useContractRead, useContractReads } from 'wagmi';
import { FAIR_LAUNCH_ERC20_TOKEN_ABI } from '@/lib/contracts/abi-types';

export function useTokenDetails(address: string) {
  const [token, setToken] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: contractData, isError, isLoading } = useContractReads({
    contracts: [
      {
        address: address as `0x${string}`,
        abi: FAIR_LAUNCH_ERC20_TOKEN_ABI,
        functionName: 'metadataHash',
      },
      {
        address: address as `0x${string}`,
        abi: FAIR_LAUNCH_ERC20_TOKEN_ABI,
        functionName: 'creator',
      }
    ],
  });

  useEffect(() => {
    if (contractData && contractData[0]?.result) {
      const metadataHash = contractData[0].result as string;
      const creator = contractData[1]?.result as string;

      fetch(`https://gateway.pinata.cloud/ipfs/${metadataHash}`)
        .then(response => response.json())
        .then(metadata => {
          // Convert creationTimestamp to launchDate
          const launchDate = metadata.creationTimestamp 
            ? new Date(metadata.creationTimestamp * 1000) 
            : null;

          setToken({
            address,
            creator,
            ...metadata,
            launchDate, // Add converted launchDate
          });
        })
        .catch(err => {
          console.error('Error fetching token metadata:', err);
          setError('Failed to fetch token metadata');
        });
    }
  }, [contractData, address]);

  return { 
    token, 
    isLoading: isLoading && !token, 
    error: isError ? 'Failed to fetch token data' : error 
  };
}
