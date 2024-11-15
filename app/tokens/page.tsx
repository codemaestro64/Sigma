'use client';

import { useState } from 'react';
import { TokenCard } from '@/components/tokens/token-card';
import { TokenFilters } from '@/components/tokens/token-filters';
import { useTokenList } from '@/hooks/use-token-list';

export default function TokensPage() {
  const [filter, setFilter] = useState('all');
  const { tokens, isLoading } = useTokenList();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const filteredTokens = tokens?.filter((token) => {
    if (filter === 'all') return true;
    // Add other filter conditions as needed
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Tokens</h1>
      <TokenFilters filter={filter} onFilterChange={setFilter} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredTokens?.map((token) => (
          <TokenCard key={token.address} token={token} />
        ))}
      </div>
    </div>
  );
}
