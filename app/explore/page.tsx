'use client';

import { useState, useEffect, useCallback } from 'react';
import { TokenCard } from '@/components/tokens/token-card';
import { TokenFilters } from '@/components/tokens/token-filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, LayoutGrid, List, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TransactionMarquee } from '@/components/tokens/transaction-marquee';
import { useTokenList } from '@/hooks/use-token-list';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious, 
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useTokenStore } from '@/lib/store/token-store';
import { useMigrationProgress } from '@/hooks/use-migration-progress';
import { useTokensUpdates } from '@/hooks/use-token-updates';
import { useReadContracts } from 'wagmi';
import { FAIR_LAUNCH_ERC20_TOKEN_ABI, FAIR_LAUNCH_ABI } from '@/lib/contracts/abi-types';
import { FAIR_LAUNCH_ADDRESS } from '@/lib/contracts/addresses';
import { formatEther } from 'viem';
import { TopTokens } from '@/components/tokens/top-tokens';
import { FeaturedTokens } from '@/components/tokens/featured-tokens';

const TOKENS_PER_PAGE = 10;

export default function ExplorePage() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const { tokens, isLoading } = useTokenList();

  // Update all tokens data at once
  useTokensUpdates(tokens?.map(token => token.address));

  // Get migration data for sorting
  const { data: migrationData } = useReadContracts({
    contracts: tokens?.map(token => ({
      address: token.address as `0x${string}`,
      abi: FAIR_LAUNCH_ERC20_TOKEN_ABI,
      functionName: 'balanceOf',
      args: [FAIR_LAUNCH_ADDRESS],
    })) ?? [],
  });

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Filter and sort tokens
  const filteredAndSortedTokens = tokens
    ?.filter(token => {
      if (!searchQuery) return true;
      return (
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (b.launchDate?.getTime() ?? 0) - (a.launchDate?.getTime() ?? 0);
        case 'oldest':
          return (a.launchDate?.getTime() ?? 0) - (b.launchDate?.getTime() ?? 0);
        case 'volume':
          const volumeA = useTokenStore.getState().volumes[a.address] || 0;
          const volumeB = useTokenStore.getState().volumes[b.address] || 0;
          // If volumes are equal (including both being 0), sort by newest first
          if (volumeA === volumeB) {
            return (b.launchDate?.getTime() ?? 0) - (a.launchDate?.getTime() ?? 0);
          }
          return volumeB - volumeA;
        case 'migration':
          // Get the remaining tokens for each token
          const indexA = tokens?.findIndex(t => t.address === a.address) ?? -1;
          const indexB = tokens?.findIndex(t => t.address === b.address) ?? -1;
          
          const remainingA = migrationData?.[indexA]?.result ? 
            parseFloat(formatEther(migrationData[indexA].result as bigint)) : 0;
          const remainingB = migrationData?.[indexB]?.result ? 
            parseFloat(formatEther(migrationData[indexB].result as bigint)) : 0;
          
          // If remaining tokens are equal, sort by newest first
          if (remainingA === remainingB) {
            return (b.launchDate?.getTime() ?? 0) - (a.launchDate?.getTime() ?? 0);
          }
          // Sort by remaining tokens (less remaining = closer to migration)
          return remainingA - remainingB;
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil((filteredAndSortedTokens?.length || 0) / TOKENS_PER_PAGE);
  const startIndex = (currentPage - 1) * TOKENS_PER_PAGE;
  const paginatedTokens = filteredAndSortedTokens?.slice(startIndex, startIndex + TOKENS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="container py-0">
        <TransactionMarquee />
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading tokens...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-0">
      <TransactionMarquee />
      <div className="py-4">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold">Explore Tokens</h1>
          <p className="text-muted-foreground">
            Discover and trade new tokens launched on Sigma.fun
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tokens..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-9 pr-4"
                />
              </div>
              <div className="flex gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="volume">Highest Volume (24h)</SelectItem>
                    <SelectItem value="migration">Closest to Migration</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="w-10"
                >
                  {viewMode === 'grid' ? (
                    <List className="h-4 w-4" />
                  ) : (
                    <LayoutGrid className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full sm:w-auto"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {showFilters && (
                <div>
                  <TokenFilters filter={filter} onFilterChange={setFilter} />
                </div>
              )}
              <div>
                <div className={cn(
                  "mt-0 gap-3",
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2"
                    : "flex flex-col"
                )}>
                  {paginatedTokens?.map((token) => (
                    <TokenCard
                      key={token.address}
                      token={token}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination className="mt-8">
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
                        let pageNumber;
                        if (currentPage <= 2) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 1) {
                          pageNumber = totalPages - 2 + i;
                        } else {
                          pageNumber = currentPage - 1 + i;
                        }

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
                      })}
                      
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
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-4 lg:self-start">
            <TopTokens tokens={tokens ?? []} />
            <FeaturedTokens tokens={tokens ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}
