"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTokenSwap } from "@/hooks/use-token-swap";
import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";
import { useTokenStore } from '@/lib/store/token-store';
import { useTokenUpdates } from '@/hooks/use-token-updates';

interface TokenSwapProps {
  token: {
    address?: string;
    symbol: string;
    decimals: number;
  };
}

export function TokenSwap({ token }: TokenSwapProps) {
  const [isBuying, setIsBuying] = useState(true);
  const { address } = useAccount();
  const {
    amount,
    setAmount,
    receiveAmount,
    handleBuy,
    handleSell,
    isConfirming,
    isBuySuccess,
    isSellSuccess,
    needsApproval,
  } = useTokenSwap(token.address || '', isBuying);

  const { data: ethBalance } = useBalance({
    address: address,
  });

  const { data: tokenBalance } = useBalance({
    address: address,
    token: token.address as `0x${string}`,
  });

  useTokenUpdates(token.address);

  const tokenPrice = useTokenStore((state) => state.prices[token.address || '']);

  const handleSwitch = () => {
    setIsBuying(!isBuying);
    setAmount("");
  };

  const handleSubmit = () => {
    if (isBuying) {
      handleBuy();
    } else {
      handleSell();
    }
  };

  const handleBalanceClick = () => {
    if (isBuying) {
      setAmount(ethBalance?.formatted || "0");
    } else {
      setAmount(tokenBalance?.formatted || "0");
    }
  };

  const formatBalance = (balance: bigint | undefined, decimals: number) => {
    if (!balance) return "0";
    const formatted = formatUnits(balance, decimals);
    return parseFloat(formatted).toLocaleString(undefined, {
      maximumFractionDigits: decimals,
      minimumFractionDigits: 0,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Swap</CardTitle>
        <div className="flex items-center space-x-2">
          <Label htmlFor="swap-mode" className={cn(isBuying ? "text-green-500" : "text-muted-foreground")}>Buy</Label>
          <Switch
            id="swap-mode"
            checked={!isBuying}
            onCheckedChange={handleSwitch}
            className="data-[state=checked]:bg-red-700 data-[state=unchecked]:bg-green-700"
          />
          <Label htmlFor="swap-mode" className={cn(!isBuying ? "text-red-500" : "text-muted-foreground")}>Sell</Label>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Send</label>
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="flex justify-between mt-1">
              <p className="text-sm text-muted-foreground">
                {isBuying ? "ETH" : token.symbol}
              </p>
              {address && (
                <p 
                  className="text-xs text-muted-foreground cursor-pointer hover:text-primary"
                  onClick={handleBalanceClick}
                >
                  Balance: {isBuying 
                    ? formatBalance(ethBalance?.value, 18)
                    : formatBalance(tokenBalance?.value, 18)}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Receive</label>
            <Input
              type="number"
              placeholder="0.0"
              value={receiveAmount}
              readOnly
            />
            <div className="flex justify-between mt-1">
              <p className="text-sm text-muted-foreground">
                {isBuying ? token.symbol : "ETH"}
              </p>
              {address && (
                <p className="text-xs text-muted-foreground">
                  Balance: {isBuying 
                    ? formatBalance(tokenBalance?.value, 18)
                    : formatBalance(ethBalance?.value, 18)}
                </p>
              )}
            </div>
          </div>
          <Button 
            className={cn(
              "w-full",
              isBuying ? "bg-green-900 hover:bg-green-800" : "bg-red-900 hover:bg-red-800"
            )}
            size="lg"
            onClick={handleSubmit}
            disabled={isConfirming || !address}
          >
            {isConfirming
              ? "Confirming..."
              : isBuying
              ? "Buy"
              : "Sell"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
