'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Copy, Share2, Twitter, Send } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useReferralStore } from '@/lib/store/referral-store';

interface ReferralCode {
  code: string;
  url: string;
}

export function PersonalReferral() {
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
      setReferralCode({
        code: newCode,
        url: `https://yourapp.com/ref/${newCode}`,
      });
      setIsCreatingCode(false);
      toast({
        title: "Success",
        description: "Your referral has been created!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create referral. Please try again.",
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

  const shareOnTelegram = () => {
    const text = `Check out this awesome platform! Use my referral code: ${referralCode?.code}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralCode?.url || '')}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (!address) {
    return null;
  }

  return (
    <Card className="p-6 max-w-[calc(100vw-2rem)]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Referral</h2>
          <p className="text-sm text-muted-foreground">Earn fees from trades and token launches!</p>
          {!referralCode && (
            <Dialog open={isCreatingCode} onOpenChange={setIsCreatingCode}>
              <DialogTrigger asChild>
                <Button>Create Referral Code</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Your Referral Code</DialogTitle>
                  <DialogDescription>
                    Create a unique referral code to share with others. You'll earn a % of the fees when they use your code!
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Referral Code</Label>
                    <Input
                      id="code"
                      placeholder="Enter your desired referral code"
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
          <div className="space-y-4">
            <div className="flex items-center gap-4">
            <div className="flex-grow">
                <Label>Referral Link</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input value={referralCode.url} readOnly />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(referralCode.url)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-grow">
                <Label>Your Referral Code</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input value={referralCode.code} readOnly />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(referralCode.code)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => copyToClipboard(referralCode.url)}
              >
                <Share2 className="h-4 w-4" />
                Copy Link
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={shareOnTwitter}
              >
                <Twitter className="h-4 w-4" />
                Share on Twitter
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={shareOnTelegram}
              >
                <Send className="h-4 w-4" />
                Share on Telegram
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 