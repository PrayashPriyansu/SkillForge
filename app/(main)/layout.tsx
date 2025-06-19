'use client';

import { PropsWithChildren } from 'react';

import { UserSync } from '@/components/auth/user-sync';
import { AppSidebar } from '@/components/global/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { mainSidebarTopItems } from '@/utils/contants';

type Props = PropsWithChildren & object;
function layout({ children }: Props) {
  return (
    <div className="relative flex h-full w-full flex-col">
      <UserSync />
      <SidebarProvider>
        <AppSidebar topItems={mainSidebarTopItems} />
        <main className="flex max-h-dvh flex-grow flex-col overflow-y-auto">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
export default layout;
