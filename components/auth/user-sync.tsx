'use client';

import { useEffect } from 'react';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

import { useGlobalStore } from '../providers/store-provider';

export function UserSync() {
  const user = useQuery(api.user.currentUser);
  const setUser = useGlobalStore((state) => state.setUser);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  if (user === undefined) {
    return null;
  }

  return null;
}
