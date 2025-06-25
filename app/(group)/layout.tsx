import { PropsWithChildren } from 'react';

import RoleSync from '@/components/auth/role-sync';

type Props = PropsWithChildren & {};
function layout({ children }: Props) {
  return (
    <RoleSync>
      <div className="flex h-dvh w-dvw max-w-full flex-col overflow-x-hidden overflow-y-auto">
        {children}
      </div>
    </RoleSync>
  );
}
export default layout;
