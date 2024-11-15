export interface Token {
  id?: string;
  address: string;
  name: string;
  symbol: string;
  icon?: string;
  price: number;
  volume24h: number;
  migrationProgress: number;
  launchDate?: Date;
  description: string;
  creator?: string;
  website?: string;
  socials?: {
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
}

export interface FaucetToken extends Token {
  id: string;
  claimAmount: number;
  cooldownPeriod: string;
  totalClaimed: number;
  remainingTokens: number;
}

export interface TokenMetadata {
  icon?: string;
  description?: string;
  creationTimestamp?: number;
  launchDate?: Date;
  // ... other metadata fields
}
