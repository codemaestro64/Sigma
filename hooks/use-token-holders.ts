import { useState, useEffect, useRef } from 'react';
import { request, gql } from 'graphql-request';

const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/93277/testbalance/0.0.3';

const GET_TOKEN_HOLDERS = gql`
  query GetTokenHolders($tokenAddress: ID!) {
    token(id: $tokenAddress) {
      holders(first: 10, orderBy: balance, orderDirection: desc) {
        address
        balance
        percentage
        lastUpdated
      }
    }
  }
`;

export function useTokenHolders(tokenAddress: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    const fetchHolders = async () => {
      if (!tokenAddress) return;
      
      try {
        const result = await request(SUBGRAPH_URL, GET_TOKEN_HOLDERS, {
          tokenAddress: tokenAddress.toLowerCase(),
        });

        if (!mounted.current) return;
        
        setData(result);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching holders:', err);
        if (!mounted.current) return;
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchHolders();

    return () => {
      mounted.current = false;
    };
  }, [tokenAddress]);

  return { data, loading, error };
} 