// src/stores/counter-store.ts
import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { Doc, Id } from '@/convex/_generated/dataModel';

export type GlobalState = {
  user: Doc<'users'>;
};

export type GlobalActions = {
  setUser: (user: Doc<'users'>) => void;
};

export type GlobalStore = GlobalState & GlobalActions;

export const defaultInitState: GlobalState = {
  user: {
    _id: '' as Id<'users'>,
    _creationTime: 0,
  },
};

export const createGlobalStore = (
  initState: GlobalState = defaultInitState
) => {
  return createStore<GlobalStore>()(
    persist(
      (set) => ({
        ...initState,
        setUser: (user: Doc<'users'>) => set((state) => ({ ...state, user })),
      }),
      {
        name: 'global-store',
      }
    )
  );
};
