import { create } from 'zustand';

interface ReferralCode {
  code: string;
  url: string;
}

interface ReferralStore {
  referralCode: ReferralCode | null;
  setReferralCode: (code: ReferralCode | null) => void;
}

export const useReferralStore = create<ReferralStore>((set) => ({
  referralCode: null,
  setReferralCode: (code) => set({ referralCode: code }),
})); 