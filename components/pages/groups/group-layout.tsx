'use client';

import { useParams } from 'next/navigation';
import { PropsWithChildren } from 'react';

import { AppSidebar } from '@/components/global/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getGroupSidebarTopItems } from '@/utils/contants';

import GroupHeader from './group-header';

type Props = PropsWithChildren & {};
function GroupLayout({ children }: Props) {
  const { _id } = useParams();

  const groupSidebarTopItems = getGroupSidebarTopItems(_id as string);
  return (
    <SidebarProvider className="flex h-dvh">
      <AppSidebar topItems={groupSidebarTopItems} />
      <div className="flex flex-1 flex-col">
        <GroupHeader />

        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </SidebarProvider>
  );
}
export default GroupLayout;
