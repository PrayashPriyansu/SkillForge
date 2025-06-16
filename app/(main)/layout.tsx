'use client';

import { PropsWithChildren } from 'react';

import { UserSync } from '@/components/auth/user-sync';
import { AppSidebar } from '@/components/global/app-sidebar';
import { GlobalStoreProvider } from '@/components/providers/store-provider';
import { SidebarProvider } from '@/components/ui/sidebar';

type Props = PropsWithChildren & object;
function layout({ children }: Props) {
  return (
    <div className="relative flex h-full w-full flex-col">
      <GlobalStoreProvider>
        <UserSync />
        <SidebarProvider>
          <AppSidebar />
          <main className="flex max-h-dvh flex-grow flex-col overflow-y-auto">
            {children}
          </main>
        </SidebarProvider>
      </GlobalStoreProvider>
    </div>
  );
}
export default layout;
