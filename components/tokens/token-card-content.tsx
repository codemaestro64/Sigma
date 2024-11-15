'use client';

import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';
import { Token } from '@/lib/types';
import { useTokenPrice } from '@/hooks/use-token-price';
import { useTokenStore } from '@/lib/store/token-store';

interface TokenCardContentProps {
  token: Partial<Token>;
  priceInEth?: string;
  isPreview?: boolean;
}

export function TokenCardContent({ token, priceInEth, isPreview = false }: TokenCardContentProps) {
  const firstLineDescription = token.description?.split('\n')[0] || '';
  const { priceInEth: tokenPrice, ethUsdPrice } = useTokenPrice(token.address || '');
  
  // Get volume from store
  const volume = useTokenStore((state) => {
    return state.volumes[token.address || ''] || 0;
  });

  const previewData = {
    price: '0.00000002814',
    priceUSD: '0.03',
    volume24h: '69,420,000',
    migrationProgress: 67,
    address: `0x420ee7b035...5efb31df545b`,
    launchDate: new Date('2024-01-01'),
  };

  // Helper function to safely get migration progress
  const getMigrationProgress = () => {
    if (isPreview) return previewData.migrationProgress;
    return token.migrationProgress?.toFixed(3) ?? '0';
  };

  const getUsdPrice = () => {
    if (isPreview) return previewData.priceUSD;
    const ethPrice = parseFloat(priceInEth || tokenPrice || '0');
    return (ethPrice * ethUsdPrice).toFixed(10);
  };

  // Format price with consistent decimals for small numbers
  const formatPrice = (price: string) => {
    const priceNum = parseFloat(price);
    if (priceNum === 0) return "0";
    if (priceNum < 0.00001) {
      return priceNum.toFixed(18).replace(/\.?0+$/, "");
    }
    return priceNum.toFixed(8).replace(/\.?0+$/, "");
  };

  // Format volume with appropriate units (K, M, B)
  const formatVolume = (vol: number) => {
    if (vol === 0) return '0 ETH';
    if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B ETH`;
    if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M ETH`;
    if (vol >= 1e3) return `${(vol / 1e3).toFixed(2)}K ETH`;
    return `${vol.toFixed(2)} ETH`;
  };

  const formattedUsdVolume = (volume * ethUsdPrice).toFixed(2);

  return (
    <div className="p-2.5">
      <div className="mb-1 flex items-start justify-between">
        <div className="flex items-center gap-0">
          <div className="mr-2 relative h-12 w-12 overflow-hidden rounded-lg">
            {token.icon ? (
              <Image
                src={`https://easy-peasy.ai/cdn-cgi/image/quality=100,format=auto,width=80/${token.icon}`}
                alt={token.name || ''}
                fill
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary text-lg">
                {token.symbol?.slice(0, 2)}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold">{token.name || 'Token Name'}</h3>
            <p className="text-sm text-muted-foreground">{token.symbol || 'SYMBOL'}</p>
          </div>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-muted-foreground">24h Vol.</p>
          <p className="text-xs">{formatVolume(volume)}</p>
          <p className="text-xs text-muted-foreground">
            ${formattedUsdVolume}
          </p>
        </div>
      </div>

      {/*
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{firstLineDescription}</p>
      */}

      <div className="space-y-2">
        <Progress className="mt-2"
          value={isPreview ? previewData.migrationProgress : token.migrationProgress ?? 0} 
        />
        <div className="flex justify-between text-sm">
          <span>Migration Progress</span>
          <span className="text-sm">
            {getMigrationProgress()}%
          </span>
        </div>
      </div>
      <div className="flex justify-between font-mono text-muted-foreground text-xs mt-1">
        <div>
          <span title={token.address || previewData.address}>{token.address?.slice(0, 10)}...{token.address?.slice(-10) || previewData.address}</span>
        </div>
        <div>
          <span title={token.launchDate?.toLocaleString() || previewData.launchDate.toLocaleString()}>{token.launchDate && formatDistanceToNow(new Date(token.launchDate), { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
}
