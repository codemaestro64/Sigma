'use client';

import { useState, useEffect } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
import { FAIR_LAUNCH_FACTORY_ABI } from '@/lib/contracts/FairLaunchFactory';
import { FAIR_LAUNCH_TOKEN_FACTORY_ADDRESS } from '@/lib/contracts/addresses';
import { FAIR_LAUNCH_ERC20_TOKEN_ABI } from '@/lib/contracts/abi-types';
import { Token, TokenMetadata } from '@/lib/types';

export function useTokenList() {
  const [tokens, setTokens] = useState<Token[] | null>(null);

  const { data: tokenAddresses, isError, isLoading: isLoadingAddresses } = useReadContract({
    address: FAIR_LAUNCH_TOKEN_FACTORY_ADDRESS,
    abi: FAIR_LAUNCH_FACTORY_ABI,
    functionName: 'getTokenList',
  });

  const { data: tokenData, isLoading: isLoadingTokenData } = useReadContracts({
    contracts: tokenAddresses?.map((address) => [
      {
        address,
        abi: FAIR_LAUNCH_ERC20_TOKEN_ABI,
        functionName: 'name',
      },
      {
        address,
        abi: FAIR_LAUNCH_ERC20_TOKEN_ABI,
        functionName: 'symbol',
      },
      {
        address,
        abi: FAIR_LAUNCH_ERC20_TOKEN_ABI,
        functionName: 'metadataHash',
      },
    ]).flat() ?? [],
  });

  useEffect(() => {
    if (tokenAddresses && Array.isArray(tokenAddresses) && tokenData) {
      const tokenPromises = tokenAddresses.map(async (address, index) => {
        const name = tokenData[index * 3]?.result as string;
        const symbol = tokenData[index * 3 + 1]?.result as string;
        const metadataHash = tokenData[index * 3 + 2]?.result as string;

        let metadata: TokenMetadata = {};
        if (metadataHash) {
          try {
            const response = await fetch(`https://gateway.pinata.cloud/ipfs/${metadataHash}`);
            metadata = await response.json();
            
            // Convert creationTimestamp to launchDate
            if (metadata.creationTimestamp) {
              metadata.launchDate = new Date(metadata.creationTimestamp * 1000);
            }
          } catch (error) {
            console.error(`Failed to fetch metadata for token ${address}:`, error);
          }
        }

        return {
          address,
          name,
          symbol,
          icon: metadata.icon || '',
          description: metadata.description || '',
          price: 0,
          volume24h: 0,
          migrationProgress: 0,
          launchDate: metadata.launchDate || new Date(), // Use converted launchDate
          ...metadata,
        };
      });

      Promise.all(tokenPromises).then(setTokens);
    }
  }, [tokenAddresses, tokenData]);

  const isLoading = isLoadingAddresses || isLoadingTokenData || tokens === null;

  return { tokens, isLoading, isError };
}
