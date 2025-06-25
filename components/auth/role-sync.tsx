'use client';

import { PropsWithChildren, useEffect } from 'react';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

import { useGlobalStore } from '../providers/store-provider';

type Props = PropsWithChildren & {};
function RoleSync({ children }: Props) {
  // const { _id } = useParams();
  const setGroup = useGlobalStore((state) => state.setGroup);
  const setIsMentor = useGlobalStore((state) => state.setIsMentor);
  const _id = 'kn7915wt1dye92qztbr9926bzx7j3e1b';
  const group = useQuery(api.group.getGroup, { _id: _id as Id<'groups'> });
  const role = useQuery(api.group.getRole, { groupId: _id as Id<'groups'> });

  useEffect(() => {
    if (group && group.length > 0) {
      setGroup(group[0]);
    }

    if (role) {
      setIsMentor(role === 'mentor');
    }
  }, [role, group]);

  return <>{children}</>;
}
export default RoleSync;
