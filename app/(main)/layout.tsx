'use client';

import { PropsWithChildren } from 'react';

import Navbar from '@/components/global/nav-bar';

type Props = PropsWithChildren & {};
function layout({ children }: Props) {
  return (
    <div className="flex h-full w-full flex-col">
      <Navbar />
      <main className="flex-grow bg-[url('/dark-bg.svg')] bg-cover bg-fixed bg-center bg-no-repeat">
        {children}
      </main>
    </div>
  );
}
export default layout;
