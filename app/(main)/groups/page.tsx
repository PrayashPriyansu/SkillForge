'use client';

import { useQuery } from 'convex/react';

import { Header } from '@/components/global/app-header';
import CreateGroupForm from '@/components/pages/create-group/create-group-form';
import GroupCards from '@/components/pages/groups/group-cards';
import { api } from '@/convex/_generated/api';

type Props = object;
function Page({}: Props) {
  const groups = useQuery(api.group.getGroups, { limit: 100 });

  return (
    <>
      <Header pageName="Groups" />
      <div className="m-4 grid flex-1 grid-cols-12 gap-6 rounded">
        <CreateGroupForm />
        {groups !== undefined &&
          groups?.map((group) => <GroupCards group={group} key={group._id} />)}
      </div>
    </>
  );
}
export default Page;
