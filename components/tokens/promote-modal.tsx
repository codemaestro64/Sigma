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

interface PromoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenSymbol: string;
}

export function PromoteModal({ isOpen, onClose, tokenSymbol }: PromoteModalProps) {
  const [amount, setAmount] = useState("");

  const handlePromote = async () => {
    // TODO: Implement promotion logic
    console.log("Promoting token with amount:", amount);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100%-2rem)] sm:w-[425px] rounded-lg data-[state=open]:rounded-lg overflow-hidden">
        <DialogHeader>
          <DialogTitle>Promote {tokenSymbol}</DialogTitle>
          <DialogDescription>
            Promote your token to increase visibility. The more ETH you spend, the higher your token will be promoted.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Promotion Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Minimum promotion amount is 0.1 ETH
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handlePromote}
            disabled={!amount || parseFloat(amount) < 0.1}
          >
            Promote Token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 