'use client';

import { useState, useEffect, useRef } from 'react';
import { usePublicClient } from 'wagmi';
import { FAIR_LAUNCH_ADDRESS } from '@/lib/contracts/addresses';
import { formatEther } from 'viem';
import { request, gql } from 'graphql-request';
import { fetchTokenMetadata } from '@/lib/utils/token';

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
  buyer: string;
  amount: string;
  ethSpent: string;
}

type SellTransaction = BaseTransaction & {
  type: 'Sell';
  seller: string;
  amount: string;
  ethReceived: string;
}

type NewTokenTransaction = BaseTransaction & {
  type: 'New Token';
  creator: string;
}

export type Transaction = BuyTransaction | SellTransaction | NewTokenTransaction;

const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/93277/testfl/0.0.1';
const FACTORY_SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/93277/testflf/0.0.1';

const GET_RECENT_TRANSACTIONS = gql`
  query GetRecentTransactions {
    tokensBoughts(
      first: 10
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
      first: 10
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

const GET_NEW_TOKENS = gql`
  query GetNewTokens {
    tokenCreateds(
      first: 10
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      tokenAddress
      creator
      name
      symbol
      blockTimestamp
      transactionHash
    }
  }
`;

export function useRecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const publicClient = usePublicClient();
  const mounted = useRef(false);

  const fetchTransactions = async () => {
    try {
      const [tradeData, factoryData] = await Promise.all([
        request(SUBGRAPH_URL, GET_RECENT_TRANSACTIONS),
        request(FACTORY_SUBGRAPH_URL, GET_NEW_TOKENS),
      ]);
      
      if (!mounted.current) return;

      // Create a Set of unique token addresses from buy and sell transactions
      const tokenAddresses = new Set([
        ...tradeData.tokensBoughts.map((event: any) => event.tokenAddress),
        ...tradeData.tokensSolds.map((event: any) => event.tokenAddress),
      ]);

      // Batch fetch metadata for all unique tokens
      const metadataMap = new Map();
      try {
        const metadataPromises = Array.from(tokenAddresses).map(async (address) => {
          try {
            const metadata = await fetchTokenMetadata(publicClient, address);
            metadataMap.set(address, metadata);
          } catch (error) {
            console.error(`Error fetching metadata for ${address}:`, error);
            metadataMap.set(address, { name: 'Unknown Token', symbol: '???', icon: '/placeholder.png' });
          }
        });
        await Promise.all(metadataPromises);
      } catch (error) {
        console.error('Error fetching token metadata:', error);
      }

      const formattedTransactions = [
        // Format buy transactions
        ...tradeData.tokensBoughts.map((event: any) => {
          const metadata = metadataMap.get(event.tokenAddress) || { 
            name: 'Unknown Token', 
            symbol: '???', 
            icon: '/placeholder.png' 
          };
          return {
            type: 'Buy' as const,
            hash: event.transactionHash,
            buyer: event.buyer,
            amount: formatEther(BigInt(event.amount)),
            ethSpent: formatEther(BigInt(event.ethSpent)),
            tokenIcon: metadata.icon || '/placeholder.png',
            tokenName: metadata.name,
            tokenSymbol: metadata.symbol,
            tokenAddress: event.tokenAddress,
            timestamp: new Date(Number(event.blockTimestamp) * 1000),
          };
        }),
        // Format sell transactions
        ...tradeData.tokensSolds.map((event: any) => {
          const metadata = metadataMap.get(event.tokenAddress) || { 
            name: 'Unknown Token', 
            symbol: '???', 
            icon: '/placeholder.png' 
          };
          return {
            type: 'Sell' as const,
            hash: event.transactionHash,
            seller: event.seller,
            amount: formatEther(BigInt(event.amount)),
            ethReceived: formatEther(BigInt(event.ethReceived)),
            tokenIcon: metadata.icon || '/placeholder.png',
            tokenName: metadata.name,
            tokenSymbol: metadata.symbol,
            tokenAddress: event.tokenAddress,
            timestamp: new Date(Number(event.blockTimestamp) * 1000),
          };
        }),
        // Format new token transactions - use metadata from the event
        ...factoryData.tokenCreateds.map((event: any) => ({
          type: 'New Token' as const,
          hash: event.transactionHash,
          creator: event.creator,
          tokenIcon: '/placeholder.png', // Use placeholder for new tokens
          tokenName: event.name,
          tokenSymbol: event.symbol,
          tokenAddress: event.tokenAddress,
          timestamp: new Date(Number(event.blockTimestamp) * 1000),
        })),
      ];

      const sortedTransactions = formattedTransactions.sort(
        (a: Transaction, b: Transaction) => b.timestamp.getTime() - a.timestamp.getTime()
      );

      setTransactions(sortedTransactions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    mounted.current = true;
    fetchTransactions();
    return () => {
      mounted.current = false;
    };
  }, []);

  return { transactions, isLoading };
}
