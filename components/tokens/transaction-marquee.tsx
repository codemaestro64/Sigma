'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRecentTransactions } from '@/hooks/use-recent-transactions';
import Marquee from '@/components/ui/marquee';

export function TransactionMarquee({ maxTransactions = 20 }: { maxTransactions?: number }) {
  const { transactions, isLoading } = useRecentTransactions();

  if (isLoading) {
    return null;
  }

  const getBorderColor = (type: 'Buy' | 'Sell' | 'New Token') => {
    switch (type) {
      case 'Buy':
        return 'border-green-900';
      case 'Sell':
        return 'border-red-900';
      case 'New Token':
        return 'border-blue-500 animate-border-pulse-blue';
      default:
        return 'border-border';
    }
  };

  const formatAmount = (amount: string | undefined) => {
    if (!amount) return '0';
    return Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    });
  };

  const TransactionCard = ({ tx }: { tx: typeof transactions[0] }) => (
    <Link href={`/tokens/${tx.tokenAddress}`}>
      <Card 
        className={cn(
          "mx-0.25 flex items-center space-x-2 px-2 py-1 bg-card/50 backdrop-blur-sm border-2 transition-all duration-200 hover:scale-105",
          getBorderColor(tx.type)
        )}
      >
        <div className="relative h-9 w-9 overflow-hidden rounded-lg">
          <Image
            src={`https://easy-peasy.ai/cdn-cgi/image/quality=100,format=auto,width=80/${tx.tokenIcon}`}
            alt={tx.tokenSymbol}
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{tx.tokenName}</span>
            <span className="text-muted-foreground">({tx.tokenSymbol})</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            {tx.type === 'New Token' ? (
              <span>Launched {formatDistanceToNow(tx.timestamp)} ago</span>
            ) : (
              <>
                <span>{formatAmount(tx.amount)} {tx.tokenSymbol}</span>
                <span>{formatDistanceToNow(tx.timestamp)} ago</span>
              </>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );

  const limitedTransactions = transactions.slice(0, maxTransactions);

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 w-10 h-full bg-gradient-to-r from-[#131a29] from-50% to-transparent z-10" />
      
      <Marquee className="py-2 [--gap:0.5rem]" pauseOnHover>
        {limitedTransactions.map((tx, i) => (
          <TransactionCard key={`${tx.tokenAddress}-${i}`} tx={tx} />
        ))}
      </Marquee>

      <div className="absolute right-0 top-0 w-10 h-full bg-gradient-to-l from-[#131a29] from-50% to-transparent z-10" />
    </div>
  );
}
