"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { Transaction, useRecentTransactions } from '@/hooks/use-recent-transactions';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useTokenStore } from '@/lib/store/token-store';
import { useTokenUpdates } from '@/hooks/use-token-updates';

interface TransactionNotificationsProps {
  tokenAddress: string;
  maxNotifications?: number;
}

export function TransactionNotifications({ 
  tokenAddress, 
  maxNotifications = 5 
}: TransactionNotificationsProps) {
  const tokenData = useTokenStore((state) => state.tokens[tokenAddress]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  useEffect(() => {
    if (tokenData?.lastUpdate) {
      setLastUpdate(tokenData.lastUpdate);
    }
  }, [tokenData?.lastUpdate]);

  const [notifications, setNotifications] = useState<Transaction[]>([]);

  const transactions = tokenData?.transactions || [];
  const isLoading = !tokenData;

  const getBorderColor = (type: Transaction['type']) => {
    switch (type) {
      case 'Buy':
        return 'border-green-900 animate-border-pulse-green';
      case 'Sell':
        return 'border-red-900';
      case 'New Token':
        return 'border-blue-900/50 animate-border-pulse-blue';
      default:
        return 'border-border';
    }
  };

  useEffect(() => {
    if (transactions.length > 0) {
      if (notifications.length === 0) {
        setNotifications(transactions.slice(0, maxNotifications));
        return;
      }

      const latestTransaction = transactions[0];
      const isNewTransaction = !notifications.some(n => n.hash === latestTransaction.hash);
      
      if (isNewTransaction) {
        setNotifications(prev => [
          latestTransaction,
          ...prev.slice(0, maxNotifications - 1)
        ]);
      }
    }
  }, [transactions, maxNotifications, notifications.length]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading recent activity...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No transactions yet</p>
      </div>
    );
  }

  const formatAmount = (amount: string) => {
    return Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  };

  const getTransactionText = (tx: Transaction) => {
    if (tx.type === 'Buy') {
      return (
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground">
            <span>
              {formatAmount(tx.ethSpent)} ETH for {formatAmount(tx.amount)} {tx.tokenSymbol}
            </span>
            <span>•</span>
            <Link 
              href={`https://testnet.ftmscan.com/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {tx.buyer.slice(0, 6)}...{tx.buyer.slice(-4)}
            </Link>
          </div>
          <div className="text-[10px] md:text-xs text-muted-foreground">
            {formatDistanceToNow(tx.timestamp)} ago
          </div>
        </div>
      );
    }
    if (tx.type === 'Sell') {
      return (
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground">
            <span>
              {formatAmount(tx.amount)} {tx.tokenSymbol} for {formatAmount(tx.ethReceived)} ETH
            </span>
            <span>•</span>
            <Link 
              href={`https://testnet.ftmscan.com/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {tx.seller.slice(0, 6)}...{tx.seller.slice(-4)}
            </Link>
          </div>
          <div className="text-[10px] md:text-xs text-muted-foreground">
            {formatDistanceToNow(tx.timestamp)} ago
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative h-full flex flex-col-reverse gap-2">
      <AnimatePresence initial={false}>
        {notifications.map((tx) => (
          <motion.div
            key={tx.hash}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
          >

            <Card 
            className={cn(
                "flex items-center space-x-4 px-4 py-1.5 bg-card/50 backdrop-blur-sm border-2",
                getBorderColor(tx.type)
            )}
            >
            <div className="relative h-8 w-8 flex-shrink-0">
                <Image
                src={`https://easy-peasy.ai/cdn-cgi/image/quality=100,format=auto,width=80/${tx.tokenIcon}`}
                alt={tx.tokenSymbol}
                fill
                className="rounded-lg object-cover"
                />
            </div>
            {getTransactionText(tx)}
            </Card>

          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 