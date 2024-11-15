'use client';

import { TokenCard } from "@/components/tokens/token-card";
import { useTokenList } from "@/hooks/use-token-list";
import { Token } from "@/lib/types";

interface TokenGridProps {
  status?: string;
  searchQuery?: string;
  sortBy?: string;
}

export function TokenGrid({ status, searchQuery, sortBy = 'newest' }: TokenGridProps) {
  const { tokens, isLoading } = useTokenList();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  let filtered = tokens?.filter((token) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (filtered && sortBy) {
    switch (sortBy) {
      case 'newest':
        filtered = filtered.sort((a, b) => {
          const dateA = a.launchDate?.getTime() ?? 0;
          const dateB = b.launchDate?.getTime() ?? 0;
          return dateB - dateA;
        });
        break;
      case 'oldest':
        filtered = filtered.sort((a, b) => {
          const dateA = a.launchDate?.getTime() ?? 0;
          const dateB = b.launchDate?.getTime() ?? 0;
          return dateA - dateB;
        });
        break;
      case 'volume':
        filtered = filtered.sort((a, b) => b.volume24h - a.volume24h);
        break;
      case 'migration':
        filtered = filtered.sort((a, b) => b.migrationProgress - a.migrationProgress);
        break;
    }
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filtered?.map((token) => (
        <TokenCard key={token.address} token={token} />
      ))}
    </div>
  );
}
