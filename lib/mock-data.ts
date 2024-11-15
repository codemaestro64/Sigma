import { Token } from './types';

export const mockTokens: Token[] = [
  {
    address: "0x1234567890123456789012345678901234567890",
    name: "Fair Token",
    symbol: "FAIR",
    icon: "https://example.com/fair-token-icon.png",
    price: 0.1,
    volume24h: 1000000,
    migrationProgress: 75,
    launchDate: new Date("2023-01-01"),
    description: "The first fair launch token on the platform",
    socials: {
      website: "https://fairtoken.com",
      twitter: "https://twitter.com/fairtoken",
      telegram: "https://t.me/fairtoken",
    },
  },
  // Add more mock tokens as needed
];
