import { fantomTestnet } from "wagmi/chains";
import { Chain } from "wagmi";

export const supportedChains: Chain[] = [fantomTestnet];

export const defaultChain = fantomTestnet;

export const isChainSupported = (chainId: number) => {
  return supportedChains.some((chain) => chain.id === chainId);
};