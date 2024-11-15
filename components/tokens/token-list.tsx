'use client';

import { Token } from "@/lib/types";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useTokenStore } from "@/lib/store/token-store";
import { Progress } from "@/components/ui/progress";
import { useTokenPrice } from "@/hooks/use-token-price";

interface TokenListProps {
  tokens: Token[];
}

export function TokenList({ tokens }: TokenListProps) {
  return (
    <div className="space-y-4">
      {tokens.map((token) => (
        <TokenListItem key={token.address} token={token} />
      ))}
    </div>
  );
}

function TokenListItem({ token }: { token: Token }) {
  const { priceInEth, ethUsdPrice } = useTokenPrice(token.address);
  const storePrice = useTokenStore((state) => state.prices[token.address]);
  const volume = useTokenStore((state) => state.volumes[token.address] || 0);
  const tokenData = useTokenStore((state) => state.tokens[token.address]);

  // Use store price if available, fallback to priceInEth
  const currentPrice = (storePrice && parseFloat(storePrice) > 0) 
    ? storePrice 
    : (priceInEth || "0");

  // Format price with consistent decimals
  const formatPrice = (price: string) => {
    const priceNum = parseFloat(price);
    if (priceNum === 0) return "0";
    if (priceNum < 0.000001) return priceNum.toExponential(4);
    return priceNum.toFixed(6);
  };

  const formattedUsdPrice = (() => {
    const usdPrice = parseFloat(currentPrice) * ethUsdPrice;
    if (usdPrice === 0) return "0";
    if (usdPrice < 0.000001) return usdPrice.toExponential(4);
    return usdPrice.toFixed(8);
  })();

  // Use migration progress from store if available
  const migrationProgress = tokenData?.migrationProgress ?? token.migrationProgress;

  return (
    <Link href={`/tokens/${token.address}`}>
      <Card className="p-4 hover:bg-accent/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-lg">
              <Image
                src={token.icon as string}
                alt={token.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">{token.name}</h3>
              <p className="text-sm text-muted-foreground">{token.symbol}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Launched {formatDistanceToNow(token.launchDate || new Date())} ago
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-8">
            <div className="text-right">
              <p className="text-sm font-medium">Price</p>
              <p className="font-semibold">{formatPrice(currentPrice)} ETH</p>
              <p className="text-xs text-muted-foreground">${formattedUsdPrice}</p>
            </div>

            {volume > 0 && (
              <div className="text-right">
                <p className="text-sm font-medium">24h Volume</p>
                <p className="font-semibold">{volume.toLocaleString()} ETH</p>
                <p className="text-xs text-muted-foreground">
                  ${(volume * ethUsdPrice).toFixed(2)}
                </p>
              </div>
            )}

            <div className="text-right min-w-[140px]">
              <p className="text-sm font-medium">Migration Progress</p>
              <Progress value={migrationProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {migrationProgress?.toFixed(2)}% Complete
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
} 