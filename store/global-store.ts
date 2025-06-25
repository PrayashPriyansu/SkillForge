// src/stores/counter-store.ts
import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { Doc, Id } from '@/convex/_generated/dataModel';

export type GlobalState = {
  user: Doc<'users'>;
  currGroup: Doc<'groups'>;
  isMentor: boolean;
};

export type GlobalActions = {
  setUser: (user: Doc<'users'>) => void;
  setGroup: (group: Doc<'groups'>) => void;
  setIsMentor: (isMentor: boolean) => void;
};

export type GlobalStore = GlobalState & GlobalActions;

export const defaultInitState: GlobalState = {
  user: {
    _id: '' as Id<'users'>,
    _creationTime: 0,
  },
  currGroup: {
    _id: '' as Id<'groups'>,
    _creationTime: 0,
    name: '',
    status: 'active',
    description: '',
    createdBy: '' as Id<'users'>,
    progress: 0,
    isComplete: false,
  },
  isMentor: false,
};

export const createGlobalStore = (
  initState: GlobalState = defaultInitState
) => {
  return createStore<GlobalStore>()(
    persist(
      (set) => ({
        ...initState,
        setUser: (user: Doc<'users'>) => set((state) => ({ ...state, user })),
        setGroup: (group: Doc<'groups'>) =>
          set((state) => ({ ...state, currGroup: group })),
        setIsMentor: (isMentor: boolean) =>
          set((state) => ({ ...state, isMentor })),
      }),
      {
        name: 'global-store',
      }
    )
  );
};
