import { fantomTestnet } from "wagmi/chains";

export const supportedChains = [fantomTestnet];

export const defaultChain = fantomTestnet;

export const isChainSupported = (chainId: number) => {
  return supportedChains.some((chain) => chain.id === chainId);
};