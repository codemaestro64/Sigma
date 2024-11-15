'use client';

import { useState } from 'react';

export function useFaucet(tokenAddress: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClaim = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Implement actual faucet claim functionality once contract is ready
      console.log('Faucet claim not implemented yet', tokenAddress);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim tokens');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleClaim,
    isLoading,
    isSuccess,
    error,
  };
}