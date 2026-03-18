import { create } from "zustand";

interface CofheState {
  isInitialized: boolean;
  setIsInitialized: (isInitialized: boolean) => void;
  balanceUpdateTrigger: number;
  triggerBalanceUpdate: () => void;
}

export const useCofheStore = create<CofheState>((set) => ({
  isInitialized: false,
  setIsInitialized: (isInitialized: boolean) => set({ isInitialized }),
  balanceUpdateTrigger: 0,
  triggerBalanceUpdate: () =>
    set((state) => ({
      balanceUpdateTrigger: state.balanceUpdateTrigger + 1,
    })),
}));
