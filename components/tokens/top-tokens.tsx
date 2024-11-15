'use client';

import { Token } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTokenStore } from "@/lib/store/token-store";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from "lucide-react";
import { useTokenPrice } from "@/hooks/use-token-price";
import { useEffect } from "react";

export function TopTokens({ tokens }: { tokens?: Token[] }) {
  const volumes = useTokenStore((state) => state.volumes);
  const prices = useTokenStore((state) => state.prices);
  const { ethUsdPrice } = useTokenPrice();
  const updatePositions = useTokenStore((state) => state.updatePositions);
  const previousPositions = useTokenStore((state) => state.previousPositions);
  const currentPositions = useTokenStore((state) => state.currentPositions);

  // Sort tokens by volume
  const sortedTokens = [...(tokens || [])].sort((a, b) => {
    const volumeA = volumes[a.address] || 0;
    const volumeB = volumes[b.address] || 0;
    return volumeB - volumeA;
  }).slice(0, 5);

  // Update positions whenever the sorted order changes
  useEffect(() => {
    const newPositions = sortedTokens.reduce((acc, token, index) => {
      acc[token.address] = index + 1;
      return acc;
    }, {} as Record<string, number>);
    
    updatePositions(newPositions);
  }, [sortedTokens.map(t => `${t.address}-${volumes[t.address]}`).join(',')]);

  if (!sortedTokens.length) {
    return null;
  }

  const getPositionChange = (address: string) => {
    const currentPosition = currentPositions[address];
    const previousPosition = previousPositions[address];
    
    if (!previousPosition && currentPosition) {
      // Token is new to the list
      return 999; // Large number to indicate it's new/trending up
    }
    
    if (!previousPosition || !currentPosition) return 0;
    // Return positive number for improvement in rank (moving up)
    return previousPosition - currentPosition;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUpIcon className="h-6 w-6 text-green-500" />
        <h2 className="text-base font-medium text-[#E6EDF3]">Top Tokens by 24h Vol</h2>
      </div>
      
      <Card className="bg-[#0D1117] border-[#30363D]">
        <CardContent className="space-y-1 p-1">
          {sortedTokens.map((token, index) => {
            const positionChange = getPositionChange(token.address);
            const price = prices[token.address] || 0;
            const usdPrice = price * ethUsdPrice;

            return (
              <Link
                key={token.address}
                href={`/tokens/${token.address}`}
                className="flex items-center justify-between hover:bg-[#161B22] p-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#7D8590] w-2">{index + 1}</span>
                  <div className="relative h-7 w-7 overflow-hidden rounded-sm">
                    {token.icon ? (
                      <Image
                        src={`https://easy-peasy.ai/cdn-cgi/image/quality=100,format=auto,width=80/${token.icon}`}
                        alt={token.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                        {token.symbol?.slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#E6EDF3]">{token.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <p className="text-sm font-medium text-[#E6EDF3]">
                      {Number(price).toFixed(4)} ETH
                    </p>
                    {positionChange !== 0 && (
                      <span>
                        {positionChange === 999 ? (
                          // New token indicator
                          <ArrowUpIcon className="h-4 w-4 text-green-500" />
                        ) : positionChange > 0 ? (
                          <ArrowUpIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 text-red-500" />
                        )}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#7D8590]">
                    ${Number(usdPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
} 