import { createStore, useStore } from '~/lib/store';

export const controlStore = createStore({
  delay: 0,
  shouldError: false,
});

export function useControlStore() {
  const state = useStore(controlStore);

  const setDelay = (value: number) => {
    controlStore.setState((prev) => {
      return { ...prev, delay: value };
    });
  };

  const setShouldError = (value: boolean) => {
    controlStore.setState((prev) => {
      return { ...prev, shouldError: value };
    });
  };

  return { ...state, setDelay, setShouldError };
}
