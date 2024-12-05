import { create } from 'zustand';

interface ControlState {
  delay: number;
  shouldError: boolean;

  setDelay: (value: number) => void;
  setShouldError: (value: boolean) => void;
}

export const useControlStore = create<ControlState>((set) => ({
  delay: 0,
  shouldError: false,
  setDelay: (value) => set(() => ({ delay: value })),
  setShouldError: (value) => set(() => ({ shouldError: value })),
}));
