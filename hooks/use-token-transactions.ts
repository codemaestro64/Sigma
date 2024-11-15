'use client';

import { useState, useEffect, useRef } from 'react';
import { formatEther } from 'viem';
import { usePublicClient } from 'wagmi';
import { FAIR_LAUNCH_ADDRESS } from '@/lib/contracts/addresses';
import { FAIR_LAUNCH_ABI, FAIR_LAUNCH_ERC20_TOKEN_ABI } from '@/lib/contracts/abi-types';
import { request, gql } from 'graphql-request';

const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/93277/testfl/0.0.1';

type BaseTransaction = {
  hash: string;
  tokenIcon: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  timestamp: Date;
}

type BuyTransaction = BaseTransaction & {
  type: 'Buy';
  amount: string;
  ethSpent: string;
  buyerAddress: string;
}

type SellTransaction = BaseTransaction & {
  type: 'Sell';
  amount: string;
  ethReceived: string;
  sellerAddress: string;
}

type NewTokenTransaction = BaseTransaction & {
  type: 'New Token';
}

export type Transaction = BuyTransaction | SellTransaction | NewTokenTransaction;

export function useTokenTransactions(tokenAddress: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const publicClient = usePublicClient();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    const fetchTransactions = async () => {
      if (!tokenAddress) return;
      
      const query = gql`
        query GetTokenTransactions($tokenAddress: String!) {
          tokensBoughts(
            where: { tokenAddress: $tokenAddress }
            orderBy: blockTimestamp
            orderDirection: desc
          ) {
            id
            tokenAddress
            buyer
            amount
            ethSpent
            blockTimestamp
            transactionHash
          }
          tokensSolds(
            where: { tokenAddress: $tokenAddress }
            orderBy: blockTimestamp
            orderDirection: desc
          ) {
            id
            tokenAddress
            seller
            amount
            ethReceived
            blockTimestamp
            transactionHash
          }
        }
      `;

      try {
        const data = await request(SUBGRAPH_URL, query, {
          tokenAddress: tokenAddress.toLowerCase(),
        }) as any;

        if (!mounted.current) return;

        const metadata = await fetchTokenMetadata(publicClient, tokenAddress);
        
        const buyTransactions = data.tokensBoughts.map((event: any) => ({
          hash: event.transactionHash,
          type: 'Buy' as const,
          amount: formatEther(BigInt(event.amount)),
          ethSpent: formatEther(BigInt(event.ethSpent)),
          buyerAddress: event.buyer,
          tokenIcon: metadata.icon || '/placeholder.png',
          tokenName: metadata.name,
          tokenSymbol: metadata.symbol,
          tokenAddress: event.tokenAddress,
          timestamp: new Date(Number(event.blockTimestamp) * 1000),
        }));

        const sellTransactions = data.tokensSolds.map((event: any) => ({
          hash: event.transactionHash,
          type: 'Sell' as const,
          amount: formatEther(BigInt(event.amount)),
          ethReceived: formatEther(BigInt(event.ethReceived)),
          sellerAddress: event.seller,
          tokenIcon: metadata.icon || '/placeholder.png',
          tokenName: metadata.name,
          tokenSymbol: metadata.symbol,
          tokenAddress: event.tokenAddress,
          timestamp: new Date(Number(event.blockTimestamp) * 1000),
        }));

        const allTransactions = [...buyTransactions, ...sellTransactions]
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        setTransactions(allTransactions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setIsLoading(false);
      }
    };

    fetchTransactions();

    return () => {
      mounted.current = false;
    };
  }, [tokenAddress, publicClient]);

  return { transactions, isLoading };
}

async function fetchTokenMetadata(publicClient: any, tokenAddress: string) {
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
