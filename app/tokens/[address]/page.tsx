'use client';

import { TokenInfo } from '@/components/tokens/token-info';
import { TokenStats } from '@/components/tokens/token-stats';
import { TokenSwap } from '@/components/tokens/token-swap';
import { TokenChart } from '@/components/tokens/token-chart';
import { TokenTransactions } from '@/components/tokens/token-transactions';
import { useTokenDetails } from '@/hooks/use-token-details';
import { TransactionNotifications } from '@/components/tokens/transaction-notifications';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TransactionHistory } from '@/components/tokens/transaction-history';
import { useTokenUpdates } from '@/hooks/use-token-updates';
import { useTokenPrice } from '@/hooks/use-token-price';
import { useTokenStats } from '@/hooks/use-token-stats';
import { Loader2 } from "lucide-react";
import { useTokenStore } from '@/lib/store/token-store';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopHolders } from '@/components/tokens/top-holders';

interface TokenPageProps {
  params: {
    address: string;
  };
}

export default function TokenPage({ params }: TokenPageProps) {
  const { address } = params;
  const tokenData = useTokenStore((state) => state.tokens[address]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  const { isInitialLoading } = useTokenUpdates(address);
  
  useEffect(() => {
    if (tokenData?.lastUpdate) {
      setLastUpdate(tokenData.lastUpdate);
    }
  }, [tokenData?.lastUpdate]);

  useEffect(() => {
    if (!tokenData) {
      useTokenStore.getState().updateToken(address, {
        // address,
        transactions: [],
        lastUpdate: Date.now(),
      });
    }
  }, [address, tokenData]);

  const { token: tokenDetails, isLoading: detailsLoading } = useTokenDetails(address);

  const mergedTokenData = tokenData && tokenDetails ? {
    ...tokenData,
    ...tokenDetails,
  } : null;

  if (isInitialLoading || detailsLoading || tokenData?.isLoading || tokenData?.updatesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!mergedTokenData) {
    return (
      <div className="bg-card rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Token not found</h2>
        <div className="text-center py-4 text-muted-foreground">
          Please check the token address and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 space-y-4">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <TokenInfo token={mergedTokenData} />
        </div>
        <div>
          <TokenStats token={mergedTokenData} />
        </div>
      </div>

      <div className="grid gap-6 mt-2 md:grid-cols-3">
        <div>
          <TokenSwap token={mergedTokenData} />
        </div>
        <div className="md:col-span-2">
          <Tabs defaultValue="activity" className="w-full space-y-0">
            <TabsList className="w-fit mb-[-0.5px] ml-1 relative z-10 bg-transparent">
              <TabsTrigger 
                value="activity" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-gray-900 data-[state=active]:to-gray-800 data-[state=inactive]:bg-background/50 data-[state=active]:border-b-0 border border-gray-700 rounded-t-lg rounded-b-none px-4 py-2.5 data-[state=inactive]:text-gray-500 data-[state=active]:text-gray-100 data-[state=inactive]:hover:translate-y-[-1px] data-[state=inactive]:hover:scale-[1.06] data-[state=inactive]:transition-transform data-[state=inactive]:duration-200 data-[state=inactive]:ease-bounce"
              >
                Live Activity
              </TabsTrigger>
              <TabsTrigger 
                value="holders" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-gray-900 data-[state=active]:to-gray-800 data-[state=inactive]:bg-background/50 data-[state=active]:border-b-0 border border-gray-700 rounded-t-lg rounded-b-none px-4 py-2.5 data-[state=inactive]:text-gray-500 data-[state=active]:text-gray-100 data-[state=inactive]:hover:translate-y-[-1px] data-[state=inactive]:hover:scale-[1.06] data-[state=inactive]:transition-transform data-[state=inactive]:duration-200 data-[state=inactive]:ease-bounce"
              >
                Top Holders
              </TabsTrigger>
            </TabsList>
            <Card>
              <CardHeader>
                <TabsContent value="activity" className="mt-0 mb-0">
                  <TransactionNotifications tokenAddress={mergedTokenData.address} />
                </TabsContent>
                <TabsContent value="holders" className="mt-0 mb-0">
                  <TopHolders token={mergedTokenData} />
                </TabsContent>
              </CardHeader>
            </Card>
          </Tabs>
        </div>
      </div>

      <div className="mt-6">
        <TokenChart token={mergedTokenData} />
      </div>

      <div className="mt-6">
        <TransactionHistory token_address={mergedTokenData?.token_address} />
      </div>
    </div>
  );
}
