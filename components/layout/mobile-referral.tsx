'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Copy, Share2, Twitter } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useReferralStore } from '@/lib/store/referral-store';
import { url } from 'inspector';

export function MobileReferral() {
  const { address } = useAccount();
  const { referralCode, setReferralCode } = useReferralStore();
  const [isCreatingCode, setIsCreatingCode] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateCode = async () => {
    try {
      setIsSubmitting(true);
      // TODO: Replace with actual API call to create referral code
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      const url = `https://fairlaunch.com/ref/${newCode}`;
      setReferralCode({
        code: newCode,
        url: url,
      });
      setIsCreatingCode(false);
      toast({
        title: "Success",
        description: "Your referral code has been created!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create referral code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    });
  };

  const shareOnTwitter = () => {
    const text = `Check out this awesome platform!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralCode?.url || '')}`;
    window.open(url, '_blank');
  };

  if (!address) return null;

  return (
    <div className="border-t border-border/50 pt-6 mt-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Your Referral Link</h3>
          {!referralCode && (
            <Dialog open={isCreatingCode} onOpenChange={setIsCreatingCode}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Create Code</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Your Referral Code</DialogTitle>
                  <DialogDescription>
                    Create a unique referral code to share with others.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile-code">Referral Code</Label>
                    <Input
                      id="mobile-code"
                      placeholder="Enter your desired code"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreateCode}
                    disabled={!newCode || isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Code'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {referralCode && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input 
                value={referralCode.url} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={() => copyToClipboard(referralCode.url)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => copyToClipboard(referralCode.url)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={shareOnTwitter}
              >
                <Twitter className="h-4 w-4 mr-2" />
                Tweet
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 