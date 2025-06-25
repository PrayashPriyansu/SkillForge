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
    <SidebarProvider className="flex h-dvh max-w-full overflow-x-hidden">
      <AppSidebar topItems={groupSidebarTopItems} />
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <GroupHeader />
        <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
export default GroupLayout;
