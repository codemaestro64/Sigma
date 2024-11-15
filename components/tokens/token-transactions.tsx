'use client';

import { Token } from "@/lib/types";
import { TransactionHistory } from "@/components/tokens/transaction-history";

interface TokenTransactionsProps {
  token: Token;
}

export function TokenTransactions({ token }: TokenTransactionsProps) {
  return (
    <div className="bg-card rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <TransactionHistory tokenAddress={token.address} />
    </div>
  );
}
