import { create } from 'zustand';

export interface PromotionDetails {
  promoEndTime: number;
  bumpEndTime: number;
  bumpCount: number;
  totalSpent: string;
}

export interface TokenStore {
  tokens: Record<string, {
    transactions: any[];
    lastUpdate: number;
  }>;
  prices: Record<string, string>;
  volumes: Record<string, number>;
  promotions: Record<string, PromotionDetails>;
  updateToken: (address: string, data: { transactions: any[]; lastUpdate: number }) => void;
  updatePrice: (address: string, price: string) => void;
  updateVolume: (address: string, volume: number) => void;
  updatePromotion: (address: string, details: PromotionDetails) => void;
  updatePositions: (positions: Record<string, number>) => void;
}

export const useTokenStore = create<TokenStore>((set) => ({
  tokens: {},
  prices: {},
  volumes: {},
  promotions: {},
  previousPositions: {},
  currentPositions: {},
  updateToken: (address, data) => 
    set((state) => ({
      tokens: {
        ...state.tokens,
        [address]: data
      }
    })),
  updatePrice: (address, price) =>
    set((state) => ({
      prices: {
        ...state.prices,
        [address]: price
      }
    })),
  updateVolume: (address, volume) =>
    set((state) => ({
      volumes: {
        ...state.volumes,
        [address]: volume
      }
    })),
  updatePromotion: (address, details) =>
    set((state) => ({
      promotions: {
        ...state.promotions,
        [address]: details
      }
    })),
  updatePositions: (positions) => {
    set((state) => ({
      previousPositions: state.currentPositions,
      currentPositions: positions,
    }));
  },
})); 