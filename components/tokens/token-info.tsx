"use client";

import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faTelegram, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faCopy, faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { Token } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, format } from 'date-fns';
import { useState } from 'react';
import { RocketIcon, TrendingUpIcon } from "lucide-react";
import { BumpModal } from "./bump-modal";
import { PromoteModal } from "./promote-modal";
import { useTokenStore } from '@/lib/store/token-store';
import { useTokenUpdates } from '@/hooks/use-token-updates';

interface TokenInfoProps {
  token: Token;
}

export function TokenInfo({ token }: TokenInfoProps) {
  const [copied, setCopied] = useState(false);
  const [isBumpModalOpen, setIsBumpModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);

  // Subscribe to updates for this token
  useTokenUpdates(token.address);

  // Get promotion details from store
  const promotionDetails = useTokenStore(
    (state) => state.promotions[token.address]
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card rounded-lg p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center">
          {token.icon && (
            <div className="mr-4 relative h-16 w-16 overflow-hidden rounded-lg">
              <Image
                src={`https://easy-peasy.ai/cdn-cgi/image/quality=100,format=auto,width=80/${token.icon}`}
                alt={`${token.name} icon`}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold mb-1">{token.name}</h1>
            <p className="text-sm text-muted-foreground">{token.symbol}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {token.website && (
            <Button variant="ghost" size="icon" asChild className="hover:bg-accent">
              <a href={token.website} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGlobe} className="h-4 w-4" />
              </a>
            </Button>
          )}
          {token.socials?.twitter && (
            <Button variant="ghost" size="icon" asChild className="hover:bg-accent">
              <a href={token.socials.twitter} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faXTwitter} className="h-4 w-4" />
              </a>
            </Button>
          )}
          {token.socials?.telegram && (
            <Button variant="ghost" size="icon" asChild className="hover:bg-accent">
              <a href={token.socials.telegram} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTelegram} className="h-4 w-4" />
              </a>
            </Button>
          )}
          {token.socials?.discord && (
            <Button variant="ghost" size="icon" asChild className="hover:bg-accent">
              <a href={token.socials.discord} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faDiscord} className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>

      <p className="text-muted-foreground mb-4 leading-relaxed">{token.description}</p>

      <div className="flex flex-col gap-2">
        <div className="flex items-center h-5">
          <span className="font-semibold text-sm w-32">Token Address:</span>
          <span className="font-mono text-sm">{token.address.slice(0, 6)}...{token.address.slice(-6)}</span>
          <a 
            href={`https://testnet.ftmscan.com/token/${token.address}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="ml-2 hover:text-accent transition-colors"
          >
            <FontAwesomeIcon icon={faExternalLink} className="h-4 w-4" />
          </a>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => copyToClipboard(token.address)}
            className="ml-1"
          >
            {copied ? 'Copied!' : <FontAwesomeIcon icon={faCopy} className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center h-5">
          <span className="font-semibold text-sm w-32">Token Creator:</span>
          <div className="flex items-center">
            <span className="font-mono text-sm">{token.creator?.slice(0, 6)}...{token.creator?.slice(-6)}</span>
            <a 
              href={`https://testnet.ftmscan.com/address/${token.creator}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 hover:text-accent transition-colors"
            >
              <FontAwesomeIcon icon={faExternalLink} className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="flex items-center h-5">
          <span className="font-semibold text-sm w-32">Time Created:</span>
          <span className="text-sm">
            {token.launchDate && format(new Date(token.launchDate), 'PPP')} 
            <span className="text-muted-foreground text-sm ml-2">
              {token.launchDate && `(${formatDistanceToNow(new Date(token.launchDate), { addSuffix: true })})`}
            </span>
          </span>
        </div>  
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Button 
          variant="outline"
          size="sm"
          onClick={() => setIsBumpModalOpen(true)}
          className="flex items-center gap-2 hover:bg-accent"
        >
          <RocketIcon className="h-4 w-4" />
          Bump
        </Button>
        <Button 
          variant="outline"
          size="sm"
          onClick={() => setIsPromoteModalOpen(true)}
          className="flex items-center gap-2 hover:bg-accent"
        >
          <TrendingUpIcon className="h-4 w-4" />
          Promote
        </Button>
      </div>

      <BumpModal 
        isOpen={isBumpModalOpen}
        onClose={() => setIsBumpModalOpen(false)}
        tokenSymbol={token.symbol}
      />
      <PromoteModal 
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
        tokenSymbol={token.symbol}
      />
    </div>
  );
}
