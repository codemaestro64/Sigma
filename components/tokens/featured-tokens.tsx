'use client';

import { Token } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTokenStore } from "@/lib/store/token-store";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { useTokenPrice } from "@/hooks/use-token-price";

export function FeaturedTokens({ tokens }: { tokens?: Token[] }) {
  const promotions = useTokenStore((state) => state.promotions);
  const prices = useTokenStore((state) => state.prices);
  const { ethUsdPrice } = useTokenPrice();

  // Filter and sort tokens by promotion status
  const promotedTokens = (tokens || [])
    .filter(token => promotions[token.address])
    .slice(0, 5);

  if (!promotedTokens.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-yellow-500" />
        <h2 className="text-base font-medium text-[#E6EDF3]">Featured</h2>
      </div>
      
      <Card className="bg-[#0D1117] border-[#30363D]">
        <CardContent className="space-y-1 p-1">
          {promotedTokens.map((token) => {
            const price = prices[token.address] || 0;
            const usdPrice = +price * ethUsdPrice;

            return (
              <Link
                key={token.address}
                href={`/tokens/${token.address}`}
                className="flex items-center justify-between hover:bg-[#161B22] p-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
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
                  <p className="text-sm font-medium text-[#E6EDF3]">
                    {Number(price).toFixed(4)} ETH
                  </p>
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