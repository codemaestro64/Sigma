'use client';

import { Token } from "@/lib/types";

interface TokenHolding {
  token: Token;
  balance: number;
  value: number;
}

// Mock data - Replace with actual API call
const mockHoldings: TokenHolding[] = [];

export function TokenHoldings() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Token Holdings</h2>
      {mockHoldings.length === 0 ? (
        <p className="text-muted-foreground">No tokens held yet.</p>
      ) : (
        <div className="grid gap-4">
          {mockHoldings.map((holding) => (
            <div
              key={holding.token.address}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-muted" />
                <div>
                  <h3 className="font-semibold">{holding.token.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {holding.balance.toLocaleString()} {holding.token.symbol}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${holding.value.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  ${(holding.value / holding.balance).toFixed(4)} per token
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}