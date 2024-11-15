import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { fantomTestnet } from 'viem/chains';
import { http } from 'wagmi';

const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY_ID;
const PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!ALCHEMY_ID) throw new Error('Missing ALCHEMY_ID');
if (!PROJECT_ID) throw new Error('Missing WALLET_CONNECT_PROJECT_ID');

// Use Alchemy's Fantom testnet endpoints
const HTTP_RPC_URL = `https://fantom-testnet.g.alchemy.com/v2/${ALCHEMY_ID}`;

export const config = getDefaultConfig({
  appName: 'Fair Launch',
  projectId: PROJECT_ID,
  chains: [fantomTestnet],
  transports: {
    [fantomTestnet.id]: http(HTTP_RPC_URL),
  },
  ssr: true,
});