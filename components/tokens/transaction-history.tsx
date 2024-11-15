"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTokenStore } from '@/lib/store/token-store';
import { formatDistanceToNow, format } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TransactionHistoryProps {
  token_address?: string;
}

const TRANSACTIONS_PER_PAGE = 10;

export function TransactionHistory({ token_address }: TransactionHistoryProps) {
  const tokenData = useTokenStore((state) => token_address ? state.tokens[token_address] : null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    if (tokenData?.lastUpdate) {
      setLastUpdate(tokenData.lastUpdate);
    }
  }, [tokenData?.lastUpdate]);

  if (!token_address) {
    return (
      <div className="bg-card rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="text-center py-4 text-muted-foreground">
          Token not found
        </div>
      </div>
    );
  }

  const transactions = tokenData?.transactions || [];
  const isLoading = !tokenData;

  const filteredTransactions = transactions.filter(tx => tx.type === 'Buy' || tx.type === 'Sell');
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / TRANSACTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
  const endIndex = startIndex + TRANSACTIONS_PER_PAGE;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);
  console.log("currentTransactions", currentTransactions);

  const formatAmount = (amount: string) => {
    return Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    });
  };

  return (
    <div className="bg-card rounded-lg p-6 space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tx Hash</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Token Amount</TableHead>
            <TableHead>ETH Amount</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTransactions.map((tx) => (
            <TableRow key={tx.hash}>
              <TableCell className="font-mono">
                <Link 
                  href={`https://testnet.ftmscan.com/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                </Link>
              </TableCell>
              <TableCell className={tx.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>
                {tx.type}
              </TableCell>
              <TableCell className="font-mono">
                <Link 
                  href={`https://testnet.ftmscan.com/address/${tx.type === 'Buy' ? tx.buyer : tx.seller}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {tx.type === 'Buy' ? 
                    `${tx.buyer.slice(0, 6)}...${tx.buyer.slice(-4)}` : 
                    `${tx.seller.slice(0, 6)}...${tx.seller.slice(-4)}`
                  }
                </Link>
              </TableCell>
              <TableCell>
                {formatAmount(tx.amount)} {tx.tokenSymbol}
              </TableCell>
              <TableCell>
                {tx.type === 'Buy' && tx.ethSpent && `${formatAmount(tx.ethSpent)} ETH`}
                {tx.type === 'Sell' && tx.ethReceived && `${formatAmount(tx.ethReceived)} ETH`}
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-default">
                      {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                    </TooltipTrigger>
                    <TooltipContent>
                      {format(tx.timestamp, 'PPpp')}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
          {currentTransactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No transactions yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {/* First page */}
            {currentPage > 2 && (
              <PaginationItem>
                <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
              </PaginationItem>
            )}
            
            {/* Ellipsis */}
            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            {/* Current page and neighbors */}
            {Array.from({ length: 3 }, (_, i) => {
              let pageNumber: any;
              if (currentPage <= 2) {
                // At the start, show 1, 2, 3
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 1) {
                // At the end, show last 3 pages
                pageNumber = totalPages - 2 + i;
              } else {
                // In the middle, show currentPage-1, currentPage, currentPage+1
                pageNumber = currentPage - 1 + i;
              }

              // Only render if the page number is valid
              if (pageNumber > 0 && pageNumber <= totalPages) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNumber)}
                      isActive={currentPage === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            }).filter(Boolean)}
            
            {/* Ellipsis */}
            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            {/* Last page */}
            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
