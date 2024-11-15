'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaucetToken } from "@/lib/types";

interface FaucetTokenCardProps {
  token: FaucetToken;
}

export function FaucetTokenCard({ token }: FaucetTokenCardProps) {
  const handleClaim = async () => {
    // Claim logic here
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative h-12 w-12">
            <Image
              src={token.icon || '/placeholder.png'} // Added fallback image
              alt={token.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{token.name}</h3>
            <p className="text-sm text-muted-foreground">{token.symbol}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Claim Amount:</span>
            <span>{token.claimAmount.toLocaleString()} {token.symbol}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cooldown:</span>
            <span>{token.cooldownPeriod}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Claimed:</span>
            <span>{token.totalClaimed.toLocaleString()} {token.symbol}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Remaining:</span>
            <span>{token.remainingTokens.toLocaleString()} {token.symbol}</span>
          </div>
        </div>

        <Button 
          className="w-full mt-4" 
          onClick={handleClaim}
        >
          Claim Tokens
        </Button>
      </div>
    </Card>
  );
}