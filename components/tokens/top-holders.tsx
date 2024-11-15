'use client';

import { Token } from "@/lib/types";
import { formatEther } from "viem";
import Link from "next/link";
import { useTokenHolders } from "@/hooks/use-token-holders";
import { Skeleton } from "@/components/ui/skeleton";
import { FAIR_LAUNCH_ADDRESS } from "@/lib/contracts/addresses";

interface TopHoldersProps {
  token: Token;
}

export function TopHolders({ token }: TopHoldersProps) {
  const { data, loading, error } = useTokenHolders(token.address);
  
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string) => {
    return parseFloat(formatEther(BigInt(balance))).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  };

  const getHolderLabel = (address: string) => {
    if (address.toLowerCase() === FAIR_LAUNCH_ADDRESS.toLowerCase()) {
      return " (pool)";
    }
    if (address.toLowerCase() === token.creator?.toLowerCase()) {
      return " (creator)";
    }
    return "";
  };

  if (loading) {
    return (
      <div className="space-y-1">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-[52px] w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive">Error loading holders</div>;
  }

  const holders = (data?.token?.holders || []).filter(holder => 
    BigInt(holder.balance) > BigInt(0)
  );

  return (
    <div className="space-y-0">
      {holders.map((holder: any, index: number) => (
        <div 
          key={holder.address} 
          className="flex items-center justify-between border-b border-gray-700 hover:bg-accent/50 transition-colors duration-200 px-0 py-1"
        >
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground w-2">{index + 1}.</span>
            <Link
              href={`https://testnet.ftmscan.com/address/${holder.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-sm"
            >
              {truncateAddress(holder.address)}
              <span className="text-muted-foreground">
                {getHolderLabel(holder.address)}
              </span>
            </Link>
          </div>
          <div className="text-right mr-2">
            <div className="text-sm">{parseFloat(holder.percentage).toFixed(2)}%</div>
            <div className="text-xs text-muted-foreground">
              {formatBalance(holder.balance)} {token.symbol}
            </div>
          </div>
        </div>
      ))}
      {holders.length === 0 && (
        <div className="text-muted-foreground text-center py-4">
          No holders found
        </div>
      )}
    </div>
  );
} 