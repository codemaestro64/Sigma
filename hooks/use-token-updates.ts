import { useEffect, useRef } from 'react';
import { usePublicClient } from 'wagmi';
import { useTokenStore } from '@/lib/store/token-store';
import { FAIR_LAUNCH_ABI, FAIR_LAUNCH_ERC20_TOKEN_ABI } from '@/lib/contracts/abi-types';
import { formatEther, parseEther } from 'viem';
import { FAIR_LAUNCH_ADDRESS } from '@/lib/contracts/addresses';
import { request, gql } from 'graphql-request';
import { fetchTokenMetadata } from '@/lib/utils/token';

const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/93277/testfl/0.0.1';

const GET_TOKEN_EVENTS = gql`
  query GetTokenEvents($tokenAddress: String!) {
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

const updateTokenStats = async (
  tokenAddress: string, 
  publicClient: any, 
  mounted: { current: boolean }
) => {
  if (!mounted.current) return;
  
  try {
    console.debug('Updating token stats for:', tokenAddress);
    
    // Get latest price using getEthOut for 1 token
    const result = await publicClient.readContract({
      address: FAIR_LAUNCH_ADDRESS,
      abi: FAIR_LAUNCH_ABI,
      functionName: 'getEthOut',
      args: [tokenAddress as `0x${string}`, parseEther('1')],
    });

    const [ethAfterFee, ethBeforeFee] = result as [bigint, bigint];

    if (!mounted.current) return;

    const formattedPrice = formatEther(ethBeforeFee);
    const priceValue = parseFloat(formattedPrice);
    useTokenStore.getState().updatePrice(tokenAddress, priceValue.toFixed(18));
    
    // Fetch events from subgraph
    const data = await request(
      SUBGRAPH_URL,
      GET_TOKEN_EVENTS,
      { tokenAddress: tokenAddress.toLowerCase() }
    );

    if (!mounted.current) return;

    console.debug('Received subgraph data:', data);

    // Fetch token metadata
    const metadata = await fetchTokenMetadata(publicClient, tokenAddress);

    // Format the events to match Transaction type
    const buyEvents = data.tokensBoughts.map((event: any) => ({
      hash: event.transactionHash,
      type: 'Buy' as const,
      amount: formatEther(BigInt(event.amount)),
      ethSpent: formatEther(BigInt(event.ethSpent)),
      buyer: event.buyer,
      tokenIcon: metadata.icon || '/placeholder.png',
      tokenName: metadata.name,
      tokenSymbol: metadata.symbol,
      tokenAddress: event.tokenAddress,
      timestamp: new Date(Number(event.blockTimestamp) * 1000),
    }));

    const sellEvents = data.tokensSolds.map((event: any) => ({
      hash: event.transactionHash,
      type: 'Sell' as const,
      amount: formatEther(BigInt(event.amount)),
      ethReceived: formatEther(BigInt(event.ethReceived)),
      seller: event.seller,
      tokenIcon: metadata.icon || '/placeholder.png',
      tokenName: metadata.name,
      tokenSymbol: metadata.symbol,
      tokenAddress: event.tokenAddress,
      timestamp: new Date(Number(event.blockTimestamp) * 1000),
    }));

    // Calculate volume using only events from the last 24 hours
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

    const volume = [...buyEvents, ...sellEvents]
      .filter(event => new Date(event.timestamp).getTime() > oneDayAgo)
      .reduce((total, event) => {
        const amount = parseFloat(event.ethSpent || event.ethReceived);
        return total + amount;
      }, 0);

    console.debug('Calculated 24h volume:', volume);
    useTokenStore.getState().updateVolume(tokenAddress, volume);

    // Sort transactions by timestamp
    const allTransactions = [...buyEvents, ...sellEvents].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    // Update token data in store with formatted transactions
    useTokenStore.getState().updateToken(tokenAddress, {
      transactions: allTransactions,
      lastUpdate: Date.now(),
    });

    // Placeholder values for promotion
    useTokenStore.getState().updatePromotion(tokenAddress, {
      promoEndTime: 0,
      bumpEndTime: 0,
      bumpCount: 0,
      totalSpent: '0',
    });
  } catch (error) {
    console.error('Error updating token stats:', error);
  }
};

export function useTokenUpdates(tokenAddress?: string) {
  const mounted = useRef(false);
  const publicClient = usePublicClient();

  useEffect(() => {
    mounted.current = true;
    
    if (!tokenAddress) {
      return;
    }

    console.debug('Setting up token updates for:', tokenAddress);
    
    // Initial stats update
    updateTokenStats(tokenAddress, publicClient, mounted);

    return () => {
      mounted.current = false;
    };
  }, [tokenAddress, publicClient]);

  return { isInitialLoading: false };
}

export function useTokensUpdates(tokenAddresses?: string[]) {
  const mounted = useRef(false);
  const publicClient = usePublicClient();

  useEffect(() => {
    mounted.current = true;
    
    if (!tokenAddresses?.length) {
      return;
    }

    console.debug('Setting up token updates for:', tokenAddresses);
    
    // Initial stats update for all tokens
    tokenAddresses.forEach(address => {
      updateTokenStats(address, publicClient, mounted);
    });

    return () => {
      mounted.current = false;
    };
  }, [tokenAddresses?.join(','), publicClient]);

  return { isInitialLoading: false };
} 