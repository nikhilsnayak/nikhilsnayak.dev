import type { Store } from './types';

export function createStore<
  T extends Record<string | number | symbol, unknown>,
>(initialState: T): Store<T> {
  let state = initialState;
  const listeners = new Set<() => void>();

  const getState = () => state;

  const setState = (updater: T | ((prev: T) => T)) => {
    state = typeof updater === 'function' ? updater(state) : updater;
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    getState,
    setState,
    subscribe,
  };
}
