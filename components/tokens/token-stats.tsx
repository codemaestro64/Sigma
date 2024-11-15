"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTokenPrice } from "@/hooks/use-token-price";
import { useTokenStats } from "@/hooks/use-token-stats";
import { useMigrationProgress } from "@/hooks/use-migration-progress";
import { useBalance } from 'wagmi';
import { formatEther } from 'viem';
import { useTokenStore } from '@/lib/store/token-store';
import { useTokenUpdates } from '@/hooks/use-token-updates';
import { useState, useEffect } from 'react';

interface TokenStatsProps {
  token: {
    address: string;
    name: string;
    symbol: string;
    volume24h?: number;
  };
}

export function TokenStats({ token }: TokenStatsProps) {
  console.debug('TokenStats render for token:', token.address);
  
  const volume = useTokenStore((state) => {
    console.debug('Volume selector called, current volumes:', state.volumes);
    return state.volumes[token.address] || 0;
  });
  
  const tokenData = useTokenStore((state) => state.tokens[token.address]);
  const storePrice = useTokenStore((state) => state.prices[token.address]);

  // Force re-render when transactions update
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  useEffect(() => {
    if (tokenData?.lastUpdate) {
      setLastUpdate(tokenData.lastUpdate);
    }
  }, [tokenData?.lastUpdate]);

  const { priceInEth, ethUsdPrice } = useTokenPrice(token.address);
  const { 
    totalSupply, 
    vestingContractAddress,
    teamTokens,
    isError: statsError,
    isLoading: statsLoading
  } = useTokenStats(token.address);
  const { 
    migrationProgress, 
    remainingTokens,
    launchContractBalance,
    poolCreationThreshold,
    isError: migrationError, 
    isLoading: migrationLoading 
  } = useMigrationProgress(token.address);

  const { data: vestingBalance } = useBalance({
    address: vestingContractAddress as `0x${string}`,
    token: token.address as `0x${string}`,
  });

  // Only use store price when it's actually defined and non-zero
  const currentPrice = (storePrice && parseFloat(storePrice) > 0) 
    ? storePrice 
    : (priceInEth || "0");
  
  const parsedTotalSupply = parseFloat(totalSupply || "0");
  const parsedLaunchBalance = parseFloat(launchContractBalance || "0");
  const parsedPoolThreshold = parseFloat(poolCreationThreshold || "0");
  const parsedRemainingTokens = parseFloat(remainingTokens || "0");

  // Only use migration progress from store if available
  const migrationProgressValue = tokenData?.migrationProgress ?? migrationProgress;
  const remainingTokensValue = tokenData?.tokensRemaining ?? remainingTokens;

  // Format price with more reasonable decimals
  const formattedPrice = (() => {
    console.log('storePrice', storePrice);
    const price = parseFloat(storePrice || "0");
    if (price === 0) return "0";
    if (price < 0.000001) return price.toExponential(4);
    return price.toFixed(6);
  })();

  const formattedUsdVolume = (volume * ethUsdPrice).toFixed(2);

  const formattedUsdPrice = (() => {
    console.log('ethUsdPrice', ethUsdPrice);
    const usdPrice = parseFloat(storePrice || "0") * ethUsdPrice;
    if (usdPrice === 0) return "0";
    if (usdPrice < 0.000001) return usdPrice.toExponential(8);
    return usdPrice.toFixed(8);
  })();

  const marketCap = (parseFloat(storePrice || "0") * parsedTotalSupply) * ethUsdPrice;

  return (
    <Card>
      <CardContent className="space-y-4 pt-3 pb-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Price Per Token</p>
          <p className="text-xl font-bold">{formattedPrice} ETH</p>
          <p className="text-sm text-muted-foreground">
            ${formattedUsdPrice}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">FDV</p>
          <p className="text-xl font-bold">
            ${marketCap.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-muted-foreground">
            Total Supply: {parsedTotalSupply.toLocaleString(undefined, { maximumFractionDigits: 0 })} {token.symbol}
          </p>
        </div>
        {volume > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">24h Volume</p>
            <p className="text-xl font-bold">{volume.toLocaleString()} ETH</p>
            <p className="text-sm text-muted-foreground">${formattedUsdVolume}</p>
          </div>
        )}
        {volume === 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">24h Volume</p>
            <p className="text-xl font-bold">0 ETH</p>
            <p className="text-sm text-muted-foreground">$0.00</p>
          </div>
        )}
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Migration Progress</span>
            <span className="text-muted-foreground">
              ({tokenData?.tokensRemaining 
                ? parseFloat(tokenData.tokensRemaining).toLocaleString(undefined, { maximumFractionDigits: 0 }) 
                : parsedRemainingTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })} {token.symbol} Remaining)
            </span>
          </div>
          <Progress value={migrationProgressValue} className="mt-2" />
          <p className="text-sm text-muted-foreground mt-1">
            {migrationProgressValue.toFixed(4)}% Complete
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
