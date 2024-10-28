import { create } from "zustand";

type UseUpgradePlanDialogType = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export const useUpgradePlanDialog = create<UseUpgradePlanDialogType>((set) => ({
  isVisible: false,
  setIsVisible: (isVisible) => set({ isVisible }),
}));
