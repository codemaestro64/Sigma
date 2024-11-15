'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaucetTokenCard } from '@/components/faucet/faucet-token-card';
import { Search } from 'lucide-react';
import { FaucetToken } from '@/lib/types';

// Mock data - Replace with actual API call
const mockTokens: FaucetToken[] = [];

export default function FaucetPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Token Faucet</h1>
        <p className="text-muted-foreground">
          Claim tokens from available faucets to try them out
        </p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockTokens.map((token) => (
          <FaucetTokenCard key={token.id} token={token} />
        ))}
      </div>
    </div>
  );
}