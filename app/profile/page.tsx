'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserStats } from '@/components/profile/user-stats';
import { TokenHoldings } from '@/components/profile/token-holdings';
import { TransactionHistory } from '@/components/profile/transaction-history';
import { TradingStats } from '@/components/profile/trading-stats';
import { UserReferrals } from '@/components/profile/user-referrals';
import { LaunchReferrals } from '@/components/profile/launch-referrals';
import { PersonalReferral } from '@/components/profile/personal-referral';

export default function ProfilePage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          View your Portfolio, Transactions, and Referrals
        </p>
      </div>

      <div className="grid gap-6">
        <UserStats />

        <PersonalReferral />

        <Tabs defaultValue="holdings" className="max-w-[calc(100vw-2rem)] space-y-0">
          <TabsList className="w-fit mb-[-0.5px] ml-1 relative z-10 bg-transparent">
            <TabsTrigger 
              value="holdings" 
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-gray-900 data-[state=active]:to-gray-800 data-[state=inactive]:bg-background/50 data-[state=active]:border-b-0 border border-gray-700 rounded-t-lg rounded-b-none px-4 py-2.5 data-[state=inactive]:text-gray-500 data-[state=active]:text-gray-100 data-[state=inactive]:hover:translate-y-[-1px] data-[state=inactive]:hover:scale-[1.06] data-[state=inactive]:transition-transform data-[state=inactive]:duration-200 data-[state=inactive]:ease-bounce"
            >
              Holdings
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-gray-900 data-[state=active]:to-gray-800 data-[state=inactive]:bg-background/50 data-[state=active]:border-b-0 border border-gray-700 rounded-t-lg rounded-b-none px-4 py-2.5 data-[state=inactive]:text-gray-500 data-[state=active]:text-gray-100 data-[state=inactive]:hover:translate-y-[-1px] data-[state=inactive]:hover:scale-[1.06] data-[state=inactive]:transition-transform data-[state=inactive]:duration-200 data-[state=inactive]:ease-bounce"
            >
              Txs
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-gray-900 data-[state=active]:to-gray-800 data-[state=inactive]:bg-background/50 data-[state=active]:border-b-0 border border-gray-700 rounded-t-lg rounded-b-none px-4 py-2.5 data-[state=inactive]:text-gray-500 data-[state=active]:text-gray-100 data-[state=inactive]:hover:translate-y-[-1px] data-[state=inactive]:hover:scale-[1.06] data-[state=inactive]:transition-transform data-[state=inactive]:duration-200 data-[state=inactive]:ease-bounce"
            >
              Stats
            </TabsTrigger>
            <TabsTrigger 
              value="user-referrals" 
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-gray-900 data-[state=active]:to-gray-800 data-[state=inactive]:bg-background/50 data-[state=active]:border-b-0 border border-gray-700 rounded-t-lg rounded-b-none px-4 py-2.5 data-[state=inactive]:text-gray-500 data-[state=active]:text-gray-100 data-[state=inactive]:hover:translate-y-[-1px] data-[state=inactive]:hover:scale-[1.06] data-[state=inactive]:transition-transform data-[state=inactive]:duration-200 data-[state=inactive]:ease-bounce"
            >
              User Refs
            </TabsTrigger>
            <TabsTrigger 
              value="launch-referrals" 
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-gray-900 data-[state=active]:to-gray-800 data-[state=inactive]:bg-background/50 data-[state=active]:border-b-0 border border-gray-700 rounded-t-lg rounded-b-none px-4 py-2.5 data-[state=inactive]:text-gray-500 data-[state=active]:text-gray-100 data-[state=inactive]:hover:translate-y-[-1px] data-[state=inactive]:hover:scale-[1.06] data-[state=inactive]:transition-transform data-[state=inactive]:duration-200 data-[state=inactive]:ease-bounce"
            >
              Launch Refs
            </TabsTrigger>
          </TabsList>
          <Card className="max-w-[calc(100vw-2rem)]">
            <TabsContent value="holdings" className="mt-0 mb-0">
              <TokenHoldings />
            </TabsContent>

            <TabsContent value="transactions" className="mt-0 mb-0">
              <TransactionHistory />
            </TabsContent>

            <TabsContent value="stats" className="mt-0 mb-0">
              <TradingStats />
            </TabsContent>

            <TabsContent value="user-referrals" className="mt-0 mb-0">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">User Referrals</h2>
                <UserReferrals />
              </div>
            </TabsContent>

            <TabsContent value="launch-referrals" className="mt-0 mb-0">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Launch Referrals</h2>
                <LaunchReferrals />
              </div>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}