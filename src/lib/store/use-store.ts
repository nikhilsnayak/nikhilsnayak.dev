import { useSyncExternalStore } from 'react';

import type { Store } from './types';

export function useStore<T>(store: Store<T>) {
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
}
