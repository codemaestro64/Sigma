'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenSymbol: string;
}

export function BumpModal({ isOpen, onClose, tokenSymbol }: BumpModalProps) {
  const [amount, setAmount] = useState("");

  const handleBump = async () => {
    // TODO: Implement bump logic
    console.log("Bumping token with amount:", amount);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100%-2rem)] sm:w-[425px] rounded-lg data-[state=open]:rounded-lg overflow-hidden">
        <DialogHeader>
          <DialogTitle>Bump {tokenSymbol}</DialogTitle>
          <DialogDescription>
            Bump your token to the top of the list. Your token will stay at the top for longer based on the amount of ETH spent.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Bump Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.05"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Minimum bump amount is 0.05 ETH
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleBump}
            disabled={!amount || parseFloat(amount) < 0.05}
          >
            Bump Token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 